const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const rootDir = require("../utils/path");

const dataLocation = path.join(rootDir, "data", "products.json");
const getProducts = (cb) => {
  fs.readFile(dataLocation, "utf8", (error, data) => {
    return cb(data ? JSON.parse(data) : []);
  });
};
const saveProducts = (products) => {
  fs.writeFile(dataLocation, JSON.stringify(products), (err) =>
    console.error(err)
  );
};

module.exports = class Product {
  constructor(id, title, photoUrl, description, price) {
    this.id = id;
    this.title = title;
    this.photoUrl = photoUrl;
    this.description = description;
    this.price = price;
  }

  add() {
    getProducts((products) => {
      this.id = randomUUID();
      products.push(this);
      saveProducts(products);
    });
  }

  update() {
    getProducts((products) => {
      const existingProductIndex = products.findIndex(
        (product) => product.id === this.id
      );

      if (existingProductIndex === -1) return;

      products[existingProductIndex] = this;
      saveProducts(products);
    });
  }

  // * method cannot be directly accessed on instances of the class, only on the class itself
  static fetchAll(cb) {
    getProducts(cb);
  }

  static findById(id, cb) {
    getProducts((products) => {
      const product = products.find((product) => product.id === id);
      cb(product);
    });
  }
};
