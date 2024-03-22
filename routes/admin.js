const { Router } = require("express");

const router = Router();
const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
});

router.post("/add-product", (req, res, next) => {
  const title = req.body.title;
  products.push({ title });

  console.log("products: ", products);
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
