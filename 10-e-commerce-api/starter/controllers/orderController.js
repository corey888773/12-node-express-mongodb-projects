const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");
const { checkPermissions } = require("../utils");

const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(StatusCodes.OK).json({ success: true, orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`Order with id ${orderId} not found`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ success: true, order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ success: true, orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`Order with id ${orderId} not found`);
  }
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ success: true, order });
};

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = "someRandomValue";
  return { clientSecret, amount };
};

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    throw new CustomError.BadRequestError("Please add some items to your cart");
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Please add tax, shipping fee");
  }
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`Product with id ${item.product} not found`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // add item price to subtotal
    subtotal += price * item.amount;
  }
  const total = subtotal + tax + shippingFee;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ success: true, order, clientSecret: order.clientSecret });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
