const path = require("path");

// Installed packages
const express = require("express");
const bodyParser = require("body-parser");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Controllers
const errorsController = require("./controllers/errors");

// Database connection
const { mongoConnect } = require("./utils/database");
const User = require("./models/user");

const app = express();
const publicFilesLocation = path.join(__dirname, "public");

const TEST_USER__ID = "6602c5ce58784ac13156b2ad";

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicFilesLocation));

// Temporary middleware
app.use((req, res, next) => {
  User.findById(TEST_USER__ID)
    .then((user) => {
      req.user = user; // save user until there is no auth
      next();
    })
    .catch((err) => console.error(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongoConnect(() => app.listen(4500));
