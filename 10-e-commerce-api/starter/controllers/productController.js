const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ success: true, products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`Product with id ${productId} not found`);
  }
  res.status(StatusCodes.OK).json({ success: true, product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`Product with id ${productId} not found`);
  }
  res.status(StatusCodes.OK).json({ success: true, product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`Product with id ${productId} not found`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ success: true });
};

const uploadProductImages = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("Please upload a file");
  }
  const { image: productImage } = req.files;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image file");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(`Please upload an image less than ${maxSize / 1024}kb`);
  }

  const imagePath = path.join(__dirname, "../public/uploads/" + `${productImage.name}`);
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ success: true, image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
};
