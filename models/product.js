const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");

const dataLocation = path.join(rootDir, "data", "products.json");
const getProducts = (cb) => {
  fs.readFile(dataLocation, "utf8", (error, data) => {
    return cb(data ? JSON.parse(data) : []);
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProducts((products) => {
      products.push(this);
      fs.writeFile(dataLocation, JSON.stringify(products), (err) => ({}));
    });
  }

  // * method cannot be directly accessed on instances of the class, only on the class itself
  static fetchAll(cb) {
    getProducts(cb);
  }
};
