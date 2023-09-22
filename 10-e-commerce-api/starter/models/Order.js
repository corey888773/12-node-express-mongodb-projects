const mongoose = require("mongoose");

const SingleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the product"],
  },
  price: {
    type: Number,
    required: [true, "please provide product price"],
    default: 0,
  },
  image: {
    type: String,
    required: [true, "please provide product image"],
    default: "/uploads/example.jpeg",
  },
  amount: { type: Number, required: [true, "Please provide amount"] },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please provide tax"],
    },
    shippingFee: { type: Number, required: [true, "Please provide shipping fee"] },
    subtotal: { type: Number, required: [true, "Please provide subtotal"] },
    total: { type: Number, required: [true, "Please provide total"] },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "canceled", "delivered", "paid"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
