const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) =>
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
      })
    )
    .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;

  Product.findByPk(id)
    .then((product) =>
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      })
    )
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) =>
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      })
    )
    .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  const user = req.user;

  user
    .getCart()
    .then((cart) =>
      cart
        .getProducts()
        .then((products) =>
          res.render("shop/cart", {
            products,
            path: "/cart",
            pageTitle: "Your Cart",
          })
        )
        .catch((err) => console.error(err))
    )
    .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const user = req.user;
  const id = req.body.productId;

  let fetchedCart;
  let quantity = 1;

  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id } });
    })
    .then((products) => {
      if (!products.length) return Product.findByPk(id);

      const product = products[0];
      const oldQuantity = product.cartItem.quantity;
      quantity = oldQuantity + 1;

      return product;
    })
    .then((product) =>
      fetchedCart.addProduct(product, { through: { quantity } })
    )
    .then(() => res.redirect("/cart"))
    .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const user = req.user;
  const id = req.body.productId;

  user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id } }))
    .then(([product]) => product.cartItem.destroy())
    .then(() => res.redirect("/cart"))
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
