const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

const { authenticateUser, authorizePermissions } = require("../middleware/authentication");

const express = require("express");

const router = express.Router();

router.route("/").post(authenticateUser, authorizePermissions("admin"), createProduct).get(getAllProducts);
router.route("/uploadImage").post(authenticateUser, authorizePermissions("admin"), uploadProductImages);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
