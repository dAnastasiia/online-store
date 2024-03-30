const { Router } = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const router = Router();

router.get("/products", adminController.getProducts);

router.get("/add-product", adminController.getAddProduct);
router.post(
  "/add-product",
  [
    body("title", "Invalid title").isString().isLength({ min: 3 }).trim(),
    body("price", "Invalid price value").isFloat(),
    body("description", "Invalid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", adminController.getEditProduct);
router.post(
  "/edit-product",
  [
    body("title", "Invalid title").isString().isLength({ min: 3 }).trim(),
    body("price", "Invalid price value").isFloat(),
    body("description", "Invalid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postEditProduct
);

// * It for request through page
// router.post("/delete-product", adminController.postDeleteProduct);

// * For requests from JS code we can use other http requests
router.delete("/product/:productId", adminController.deleteProduct);

module.exports = router;
