const path = require("path");

// Installed packages
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Controllers
const errorsController = require("./controllers/errors");

// Database connection
const mongoose = require("mongoose");
const User = require("./models/user");

// Constants
const publicFilesLocation = path.join(__dirname, "public");
const uriDb = process.env.URI_DB;

// Init
const app = express();

// Setup store for sessions
const store = new MongoDBStore({
  uri: uriDb,
  collection: "sessions",
});

store.on("error", (error) => console.error(error));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicFilesLocation));

// Setup session and pass the store for sessions
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    secret: "my secret",
    resave: false, // improve performance, resave only on change
    saveUninitialized: false,
    store,
  })
);

// Temporary middleware
app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user; // setup mongoose user with available methods
      next();
    })
    .catch((err) => console.error(err));
});

app.use(authRoutes);
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
