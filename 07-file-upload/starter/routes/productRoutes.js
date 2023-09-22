const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
} = require("../controllers/productController");
const { uploadProductImage } = require("../controllers/uploadsController");

router.route("/").post(createProduct).get(getProducts);
router.route("/uploads").post(uploadProductImage);

module.exports = router;
