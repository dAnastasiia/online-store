const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();
const publicFilesLocation = path.join(__dirname, "public");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicFilesLocation));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use("/", (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(4500);
