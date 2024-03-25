const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    product: null,
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const user = req.user;
  const { title, photoUrl, description, price } = req.body;

  user
    .createProduct({ title, photoUrl, description, price }) // sequelize method create[Entity] for associations (due to before we define relations in app.js)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const user = req.user;
  const id = req.params.productId;

  user
    .getProducts({ where: { id } }) // getProducts here is the method that get only user associated products and search through them
    .then(
      // array returns, where the first item is needed object
      ([product]) =>
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
  const user = req.user;

  user
    .getProducts()
    .then((products) =>
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      })
    )
    .catch((err) => console.error(err));
};
