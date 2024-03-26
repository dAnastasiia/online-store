const { ObjectId } = require("mongodb");

const { getDb } = require("../utils/database");

module.exports = class Product {
  constructor(title, photoUrl, description, price, id, userId) {
    this.title = title;
    this.photoUrl = photoUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    const dbTable = db.collection("products");

    try {
      const { _id } = this;
      if (_id) {
        // Update the existing product
        return dbTable.updateOne({ _id }, { $set: this });
      }

      // Add new product
      return dbTable.insertOne(this);
    } catch (error) {
      console.error(error);
    }
  }

  static findById(id) {
    const db = getDb();

    try {
      return db.collection("products").findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
    }
  }

  static deleteById(id) {
    const db = getDb();

    try {
      return db.collection("products").deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
    }
  }

  static fetchAll() {
    const db = getDb();

    try {
      return db.collection("products").find().toArray(); // toArray return all at once, while find give you one by one
    } catch (error) {
      console.error(error);
    }
  }
};
