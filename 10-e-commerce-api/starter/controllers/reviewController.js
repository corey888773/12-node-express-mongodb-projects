const { StatusCodes } = require("http-status-codes");
const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`Product with id ${productId} not found`);
  }

  const alreadyReviewed = await Review.findOne({
    user: req.user.userId,
    product: productId,
  });
  if (alreadyReviewed) {
    throw new CustomError.BadRequestError(`You have already reviewed this product`);
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: "product", select: "name company price" })
    .populate({ path: "user", select: "name" });
  res.status(StatusCodes.OK).json({ success: true, reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`Review with id ${reviewId} not found`);
  }
  res.status(StatusCodes.OK).json({ success: true, review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`Review with id ${reviewId} not found`);
  }

  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ success: true, review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`Review with id ${reviewId} not found`);
  }
  checkPermissions(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ success: true });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });

  res.status(StatusCodes.OK).json({ success: true, reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
