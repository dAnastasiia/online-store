const path = require("path");

// Installed packages
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const flash = require("connect-flash");

// Database connection
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Middlewares
const isAuth = require("./middleware/is-auth");

// Controllers
const errorsController = require("./controllers/errors");

// Models
const User = require("./models/user");

// Constants
const { MILLISECONDS_IN_DAY } = require("./utils/constants");
const publicFilesLocation = path.join(__dirname, "public");
const uriDb = process.env.URI_DB;
const secret = process.env.CSRF_SECRET;

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
      maxAge: MILLISECONDS_IN_DAY,
    },
    secret: "my secret",
    resave: false, // improve performance, resave only on change
    saveUninitialized: false,
    store,
  })
);

// CSRF protection
const {
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: () => secret,
  getTokenFromRequest: (req) => req.body._csrf,
  cookieName: "x-csrf-token",
  maxAge: MILLISECONDS_IN_DAY,
});
app.use(cookieParser());
app.use(doubleCsrfProtection);
app.use(flash()); // special area of the session used for storing messages

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.user; // * locals are available on all pages
  res.locals.csrfToken = req.csrfToken();

  next();
});

// Middlewares
app.use(async (req, res, next) => {
  if (!req.session.user) return next();

  try {
    const user = await User.findById(req.session.user._id);

    if (!user) return next();

    req.user = user;
    next();
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
});

// Setup routes
app.use(authRoutes);
app.use("/admin", isAuth, adminRoutes);
app.use(shopRoutes);

// Setup errors
app.use("/500", errorsController.get500);
app.use(errorsController.get404);

// Specific error-handling middleware
app.use((error, req, res, next) => {
  // * it gets calls of 'next(error)' function
  //   res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Server error",
    path: "/500",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(uriDb)
  .then(() =>
    app.listen(PORT, () => console.log("Server is listening on port: ", PORT))
  )
  .catch((err) => console.error(err));
