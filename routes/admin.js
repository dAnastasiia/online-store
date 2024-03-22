const path = require("path");

const { Router } = require("express");

const rootDir = require("../utils/path,js");

const router = Router();
const products = [];

router.get("/add-product", (req, res, next) => {
  const fileLocation = path.join(rootDir, "views", "add-product.html");
  res.sendFile(fileLocation);
});

router.post("/add-product", (req, res, next) => {
  const title = req.body.title;
  products.push({ title });

  console.log("products: ", products);
  res.redirect("/");
});

module.exports = router;
