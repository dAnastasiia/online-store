const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
      products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/index", {
      products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getCart = async (req, res, next) => {
  const user = req.user;

  try {
    const products = await user.getCart();

    res.render("shop/cart", {
      products,
      path: "/cart",
      pageTitle: "Your Cart",
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postCart = async (req, res, next) => {
  const user = req.user;
  const id = req.body.productId;

  try {
    const product = await Product.findById(id);
    await user.addToCart(product);

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const user = req.user;
  const id = req.body.productId;

  try {
    const product = await Product.findById(id);
    await user.removeFromCart(product);

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

exports.getOrders = async (req, res, next) => {
  const user = req.user;

  try {
    const orders = await user.getOrders();
    res.render("shop/orders", {
      orders,
      path: "/orders",
      pageTitle: "Your Orders",
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postOrder = async (req, res, next) => {
  const user = req.user;

  try {
    const result = await user.addOrder();
    console.log("result: ", result);

    res.redirect("/orders");
  } catch (error) {
    console.error(error);
  }
};

// exports.postDeleteOrder = (req, res, next) => {
//   const id = req.body.orderId;

//   Order.destroy({ where: { id } })
//     .then(() => res.redirect("/orders"))
//     .catch((err) => console.error(err));
// };
