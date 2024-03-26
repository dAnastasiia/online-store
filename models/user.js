const { ObjectId } = require("mongodb");

const { getDb } = require("../utils/database");

module.exports = class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDb();

    try {
      return db.collection("users").dbTable.insertOne(this);
    } catch (error) {
      console.error(error);
    }
  }

  static findById(id) {
    const db = getDb();

    try {
      return db.collection("users").findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
    }
  }
};
