const Product = require("../models/product");
// const Order = require("../models/order");

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

// exports.getCart = (req, res, next) => {
//   const user = req.user;

//   user
//     .getCart()
//     .then((cart) =>
//       cart
//         .getProducts()
//         .then((products) =>
//           res.render("shop/cart", {
//             products,
//             path: "/cart",
//             pageTitle: "Your Cart",
//           })
//         )
//         .catch((err) => console.error(err))
//     )
//     .catch((err) => console.error(err));
// };

// exports.postCart = (req, res, next) => {
//   const user = req.user;
//   const id = req.body.productId;

//   let fetchedCart;
//   let quantity = 1;

//   user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id } });
//     })
//     .then((products) => {
//       let product;

//       if (products.length) {
//         product = products[0];
//       }

//       if (product) {
//         const oldQuantity = product.cartItem.quantity;
//         quantity = oldQuantity + 1;

//         return product;
//       }

//       return Product.findByPk(id);
//     })
//     .then((product) =>
//       fetchedCart.addProduct(product, { through: { quantity } })
//     )
//     .then(() => res.redirect("/cart"))
//     .catch((err) => console.error(err));
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const user = req.user;
//   const id = req.body.productId;

//   user
//     .getCart()
//     .then((cart) => cart.getProducts({ where: { id } }))
//     .then(([product]) => product.cartItem.destroy())
//     .then(() => res.redirect("/cart"))
//     .catch((err) => console.error(err));
// };

// exports.getOrders = (req, res, next) => {
//   const user = req.user;

//   user
//     .getOrders({ include: ["products"] }) // include to have references to products, now in orders.ejs we are able to get product ifo to display
//     .then((orders) =>
//       res.render("shop/orders", {
//         orders,
//         path: "/orders",
//         pageTitle: "Your Orders",
//       })
//     )
//     .catch((err) => console.error(err));
// };

// exports.postOrder = (req, res, next) => {
//   const user = req.user;

//   let fetchedCart;

//   user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) =>
//       user
//         .createOrder()
//         .then((order) => {
//           const updatedProducts = products.map((product) => {
//             const quantity = product.cartItem.quantity;
//             product.orderItem = { quantity };
//             return product;
//           });

//           return order.addProducts(updatedProducts);
//         })
//         .catch((err) => console.error(err))
//     )
//     .then(() => fetchedCart.setProducts(null))
//     .then(() => res.redirect("/orders"))
//     .catch((err) => console.error(err));
// };

// exports.postDeleteOrder = (req, res, next) => {
//   const id = req.body.orderId;

//   Order.destroy({ where: { id } })
//     .then(() => res.redirect("/orders"))
//     .catch((err) => console.error(err));
// };
