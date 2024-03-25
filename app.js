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
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const TEST_USER__ID = "272835f5-0fde-41e3-b214-5e71fcc5a5b3";

const app = express();
const publicFilesLocation = path.join(__dirname, "public");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicFilesLocation));

// Temporary middleware
app.use((req, res, next) => {
  User.findByPk(TEST_USER__ID)
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
//  * We can skip connections duplicate, but no error to write it twice to better readability
// Product.belongsToMany(Cart, { through: CartItem });
// Product.belongsToMany(Order, { through: OrderItem });

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // ! DEV ONLY: update tables structure and drop the old data:
  //   .sync({ force: true })
  .sync()
  .then(() => User.findByPk(TEST_USER__ID))
  .then(
    (user) =>
      user || User.create({ name: "Anastasiia", email: "test@gmail.com" })
  )
  .then((user) => Promise.resolve(user.getCart()) || user.createCart()) // workaround to avoid creating cart on every reload
  .then(() => app.listen(4500))
  .catch((err) => console.error(err));
