const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");

const { DEFAULT_CART } = require("../utils/constants");

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

    if (isUserExist) return await res.redirect("/signup");

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      cart: DEFAULT_CART,
    });
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
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return await res.redirect("/login");

    const isPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordsMatch) return await res.redirect("/login");

    req.session.user = user;
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
