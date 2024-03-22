const express = require("express");

const app = express();

app.use("/users", (req, res, next) => {
  res.send("<h1>Users list</h1>");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Main Page</h1>");
});

app.listen(4500);
