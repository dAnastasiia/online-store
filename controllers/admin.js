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
  const product = new Product(title, photoUrl, description, price);
  product.save();

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;

  // * This is the way gow to get query params: req.query[paramName]

  Product.findById(id, (product) => {
    res.render("admin/edit-product", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
    });
  });
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
