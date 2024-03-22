const { Router } = require("express");

const { products } = require("./admin");

const router = Router();

router.get("/", (req, res, next) => {
  res.render("shop", { pageTitle: "Shop", products, path: "/" });
});

module.exports = router;
