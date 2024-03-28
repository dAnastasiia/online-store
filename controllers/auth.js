const User = require("../models/user");

const { DEFAULT_CART } = require("../utils/constants");

const userId = process.env.TEST_USER_ID;

// ------ Signup ------
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) return res.redirect("/signup");

    const user = new User({ name, email, password, cart: DEFAULT_CART });
    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
};

// ------ Login ------
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.user,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findById(userId);

    req.session.user = user; // session object is provided by express-session

    // additinal reassuring, that session was created, only after this redirect
    req.session.save((error) => {
      console.error(error);
      res.redirect("/");
    });
  } catch (error) {
    console.error(error);
  }
};

// ------ Logout ------
exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.error(error);
    res.redirect("/");
  });
};
