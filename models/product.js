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

module.exports = class Product {
  constructor(title, photoUrl, description, price) {
    this.title = title;
    this.photoUrl = photoUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = randomUUID();
    getProducts((products) => {
      products.push(this);
      fs.writeFile(dataLocation, JSON.stringify(products), (err) =>
        console.log(err)
      );
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
