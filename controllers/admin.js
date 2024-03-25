const { randomUUID } = require("crypto");

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

  Product.create({ id: randomUUID(), title, photoUrl, description, price })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;

  Product.findByPk(id)
    .then((product) =>
      res.render("admin/edit-product", {
        product,
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
      })
    )
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, photoUrl, description, price } = req.body;

  Product.findByPk(id)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.photoUrl = photoUrl;
      product.description = description;

      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.body;

  Product.destroy({ where: { id } })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) =>
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      })
    )
    .catch((err) => console.error(err));
};
