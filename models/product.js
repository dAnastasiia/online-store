const { randomUUID } = require("crypto");

const db = require("../utils/database");

const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, photoUrl, description, price) {
    this.id = id;
    this.title = title;
    this.photoUrl = photoUrl;
    this.description = description;
    this.price = price;
  }

  add() {
    return db.execute(
      // `INSERT INTO products (title, price, description, photoUrl) VALUES (${this.title}, ${this.price}, ${this.description}, ${this.photoUrl})`
      "INSERT INTO products (title, price, description, photoUrl) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.description, this.photoUrl]
    );
  }

  update() {}

  static deleteById(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
