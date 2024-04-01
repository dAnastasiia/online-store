const { Router } = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.get("/orders", isAuth, shopController.getOrders);
router.post("/delete-order", isAuth, shopController.postDeleteOrder);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.get("/checkout", shopController.getCheckout);
router.get("/checkout/cancel", shopController.getCheckout);

// ! Now manual entering this route will be move cart to orders without paying, in real backend it should be webhook (check payment route and controller)
router.get("/checkout/success", shopController.postCheckoutSuccess);

module.exports = router;
