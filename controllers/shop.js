const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const Order = require("../models/order");

// ------ Products ------
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const id = req.params.productId;

  try {
    const product = await Product.findById(id);
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ------ Cart ------
exports.getCart = async (req, res, next) => {
  const user = req.user;

  try {
    const products = await user.getCart();

    res.render("shop/cart", {
      products,
      path: "/cart",
      pageTitle: "Your Cart",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCart = async (req, res, next) => {
  const user = req.user;
  const id = req.body.productId;

  try {
    await user.addToCart(id);

    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const user = req.user;
  const id = req.body.productId;

  try {
    await user.removeFromCart(id);

    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ------ Orders ------
exports.getOrders = async (req, res, next) => {
  const user = req.user;

  try {
    const orders = await Order.find({ "user.userId": user._id });

    res.render("shop/orders", {
      orders,
      path: "/orders",
      pageTitle: "Your Orders",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postOrder = async (req, res, next) => {
  const user = req.user;
  const { name, _id: userId } = user;

  try {
    const cartProducts = await user.getCart();

    const products = cartProducts.map(({ productId, quantity }) => {
      return {
        product: { ...productId._doc }, // * _doc helps to return not ObjectId, but all content
        quantity,
      };
    });

    const order = new Order({ products, user: { name, userId } });

    await order.save();
    await user.clearCart();

    res.redirect("/orders");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteOrder = async (req, res, next) => {
  const id = req.body.orderId;

  try {
    await Order.findOneAndDelete(id);

    res.redirect("/orders");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// Invoices
exports.getInvoice = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { orderId } = req.params;

  try {
    const order = await Order.find({ orderId, "user.userId": userId });

    if (!order) return next(new Error("No order found")); // Protection of showing data to unauthorized user

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("data", "invoices", invoiceName);

    //  * This can take a lot of time if we are storing big files, we should use STREAMING instead
    //  fs.readFile(invoicePath, (err, data) => {
    //    if (err) return next(err);

    // * setup file extension
    //    res.setHeader("Content-Type", "application/pdf");

    // * setup how to open file ('inline' means opening in browser, 'attachment' — download)
    //    res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);

    // * return file
    //    res.send(data);
    //  });

    // * download step by step
    const file = fs.createReadStream(invoicePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);

    file.pipe(res);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
