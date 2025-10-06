const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const upload = require("../middleware/upload"); // multer config

router.post(
  "/",
  auth(["admin"]),
  upload.array("images", 5),   // handle form-data images
  createProduct
);
router.put("/:id", auth(["admin"]), updateProduct);
router.delete("/:id", auth(["admin"]), deleteProduct);

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;