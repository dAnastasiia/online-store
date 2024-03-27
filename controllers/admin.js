const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    product: null,
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = async (req, res, next) => {
  //   const userId = req.user._id;
  const { title, photoUrl, description, price } = req.body;

  const product = new Product({ title, photoUrl, description, price });

  try {
    await product.save(); // save() i method from from mongoose
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const id = req.params.productId;

  try {
    const product = await Product.findById(id);
    res.render("admin/edit-product", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { id, title, photoUrl, description, price } = req.body;

  try {
    const product = await Product.findById(id);
    product.title = title;
    product.photoUrl = photoUrl;
    product.description = description;
    product.price = price;

    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const { id } = req.body;

  try {
    await Product.findOneAndDelete(id);
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.error(error);
  }
};
