const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    product: null,
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, photoUrl, description, price } = req.body;
  const product = new Product(null, title, photoUrl, description, price);
  product.add();

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;

  // * The way to get query params: req.query[paramName]

  Product.findById(id, (product) => {
    res.render("admin/edit-product", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, photoUrl, description, price } = req.body;

  const product = new Product(id, title, photoUrl, description, price);
  product.update();

  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
