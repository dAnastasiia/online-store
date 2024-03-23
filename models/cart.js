const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");

const dataLocation = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(dataLocation, "utf8", (error, data) => {
      let cart = { products: [], totalPrice: 0 };

      if (data) {
        cart = JSON.parse(data);
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ id, quantity: 1 });
      }

      cart.totalPrice += +price;
      fs.writeFile(dataLocation, JSON.stringify(cart), (err) =>
        console.error(err)
      );
    });
  }
};
