const { MongoClient } = require("mongodb");

const uriDb = process.env.URI_DB;

let db;

const mongoConnect = (cb) =>
  MongoClient.connect(uriDb)
    .then((client) => {
      console.log("DB connected");
      db = client.db();
      cb();
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

const getDb = () => {
  if (!db) throw Error("No database");
  return db;
};

module.exports = { mongoConnect, getDb };
