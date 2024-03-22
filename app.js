const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", (req, res, next) => {
  const fileLocation = path.join(__dirname, "views", "404.html");
  res.status(404).sendFile(fileLocation);
});

app.listen(4500);
