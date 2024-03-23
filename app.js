const path = require("path");

// Installed packages
const express = require("express");
const bodyParser = require("body-parser");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Controllers
const errorsController = require("./controllers/errors");

const app = express();
const publicFilesLocation = path.join(__dirname, "public");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicFilesLocation));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

app.listen(4500);
