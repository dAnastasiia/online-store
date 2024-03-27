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
const mongoose = require("mongoose");
// const User = require("./models/user");

const app = express();
const publicFilesLocation = path.join(__dirname, "public");

// const userId = process.env.TEST_USER_ID;
const uriDb = process.env.URI_DB;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicFilesLocation));

// // Temporary middleware
// app.use((req, res, next) => {
//   User.findById(userId)
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id); // save user until there is no auth
//       next();
//     })
//     .catch((err) => console.error(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongoose
  .connect(uriDb)
  .then(() => {
    const port = 4500;

    app.listen(port);
    console.log("Server is listening on port: ", port);
  })
  .catch((err) => console.error(err));
