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
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");

const app = express();
const publicFilesLocation = path.join(__dirname, "public");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicFilesLocation));

// Temporary middleware
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; // save user until there is no auth
      next();
    })
    .catch((err) => console.error(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

// Define database models relations
Product.belongsTo(User, { constraint: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  // update tables structure and drop the old data during development
  //   .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then(
    (user) =>
      user || User.create({ name: "Anastasiia", email: "test@gmail.com" })
  )
  .then(() => app.listen(4500))
  .catch((err) => console.error(err));
