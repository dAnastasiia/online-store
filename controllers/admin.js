const { validationResult } = require("express-validator");

const Product = require("../models/product");

const { deleteFile } = require("../utils/file");
const { ITEMS_PER_PAGE } = require("../utils/constants");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    product: null,
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isEditMode: false,
    errorMessage: null,
    validationErrors: null,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { title, description, price } = req.body; // * we have parsers in app.js, it's in charge of parsing and extracting values
  const image = req.file;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      isEditMode: false,
      product: { title, description, price },
      errorMessage: "Attached file isn't an image",
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      isEditMode: false,
      product: { title, description, price },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const photoUrl = image.path;

  const product = new Product({
    title,
    photoUrl,
    description,
    price,
    userId,
  });

  try {
    await product.save(); // * save() is a method from mongoose
    res.redirect("/admin/products");
  } catch (err) {
    //  return res.redirect("/500"); // * this approach is only lead to code duplication

    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error); // * this means that we skip all middlewares and go right into errors handling
  }
};

exports.getEditProduct = async (req, res, next) => {
  const id = req.params.productId;

  try {
    const product = await Product.findById(id);

    if (!product) return res.redirect("/");

    res.render("admin/edit-product", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      isEditMode: true,
      errorMessage: null,
      validationErrors: null,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id, title, description, price } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      isEditMode: true,
      product: {
        _id: id,
        title,
        description,
        price,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const product = await Product.findById(id);

    const isCurrentUserProduct =
      product.userId.toString() === userId.toString();

    if (!isCurrentUserProduct) return res.redirect("/");

    product.title = title;
    product.description = description;
    product.price = price;

    if (image) {
      deleteFile(product.photoUrl); // * delete previous file
      product.photoUrl = image.path;
    }

    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// exports.postDeleteProduct = async (req, res, next) => {
//   const { _id: userId } = req.user;
//   const { id: _id } = req.body;

//   try {
//     const product = await Product.findById(_id);

//     if (!product) return next(new Error("Product not found"));

//     await Product.deleteOne({ _id, userId });
//     deleteFile(product.photoUrl);

//     res.redirect("/admin/products");
//   } catch (err) {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   }
// };

exports.deleteProduct = async (req, res, next) => {
  const { productId: _id } = req.params;
  const { _id: userId } = req.user;

  try {
    const product = await Product.findById(_id);

    if (!product) return next(new Error("Product not found"));

    await Product.deleteOne({ _id, userId });
    deleteFile(product.photoUrl);

    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error has occured" });
  }
};

exports.getProducts = async (req, res, next) => {
  const { _id: userId } = req.user;
  const page = +req.query.page || 1; // transform to number

  try {
    const totalItems = await Product.find().countDocuments();

    const products = await Product.find({ userId }) // * show only current user's products, but POST requests also should be protected
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const hasNextPage = ITEMS_PER_PAGE * page < totalItems;
    const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);

    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasNextPage,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage,
      currentPage: page,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
