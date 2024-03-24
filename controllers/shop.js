const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) =>
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

  Product.findById(id)
    .then(([prod]) => {
      const product = prod[0];
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) =>
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      })
    )
    .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  Cart.getProducts((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (let product of products) {
        const cartProduct = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProduct) {
          cartProducts.push({ data: product, quantity: cartProduct.quantity });
        }
      }

      res.render("shop/cart", {
        products: cartProducts,
        path: "/cart",
        pageTitle: "Your Cart",
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;

  Product.findById(id)
    .then(([prod]) => {
      const product = prod[0];
      Cart.addProduct(id, product.price);
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const id = req.body.productId;

  Product.findById(id)
    .then(([prod]) => {
      const product = prod[0];
      Cart.deleteProduct(id, product.price);
      res.redirect("/cart");
    })
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
