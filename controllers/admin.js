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
  product
    .add()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .then(([prod]) => {
      const product = prod[0];
      res.render("admin/edit-product", {
        product,
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
      });
    })
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, photoUrl, description, price } = req.body;

  const product = new Product(id, title, photoUrl, description, price);
  product.update();

  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.body;

  Product.deleteById(id);

  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) =>
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      })
    )
    .catch((err) => console.error(err));
};
