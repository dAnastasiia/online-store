const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");

const DEFAULT_CART = { products: [], totalPrice: 0 };
const dataLocation = path.join(rootDir, "data", "cart.json");
const getCart = (cb) => {
  fs.readFile(dataLocation, "utf8", (error, data) => {
    return cb(data ? JSON.parse(data) : DEFAULT_CART);
  });
};
const saveCart = (cart) => {
  fs.writeFile(dataLocation, JSON.stringify(cart), (err) => console.error(err));
};

module.exports = class Cart {
  static getProducts(cb) {
    getCart(cb);
  }

  static addProduct(id, price) {
    getCart((cart) => {
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ id, quantity: 1 });
      }

      cart.totalPrice += +price;
      saveCart(cart);
    });
  }

  static deleteProduct(id, price) {
    getCart((cart) => {
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      if (existingProductIndex === -1) return;

      const { quantity } = cart.products[existingProductIndex];

      const updatedProductsFirstPart = cart.products.slice(
        0,
        existingProductIndex
      );
      const updatedProductsSecondPart = cart.products.slice(
        existingProductIndex + 1
      );
      const updatedProducts = [
        ...updatedProductsFirstPart,
        ...updatedProductsSecondPart,
      ];

      cart.totalPrice -= price * quantity;
      cart.products = updatedProducts;
      saveCart(cart);
    });
  }
};
