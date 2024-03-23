const { Router } = require("express");

const adminController = require("../controllers/admin");

const router = Router();

router.get("/products", adminController.getProducts);

router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

module.exports = router;
