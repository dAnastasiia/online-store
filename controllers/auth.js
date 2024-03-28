const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");

const { DEFAULT_CART } = require("../utils/constants");
const EmailService = require("../services/email-sender");

// ------ Signup ------
exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error"); // get an access by key

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null; // clear if no message
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
  });
};

exports.postSignup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      req.flash("error", "Email already in use");
      return await res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      cart: DEFAULT_CART,
    });
    await user.save();

    res.redirect("/login");

    EmailService.sendMail({
      from: "no-reply@demomailtrap.com",
      to: email,
      subject: "Hello from Mailtrap!",
      html: `<h1>${name}, welcome to system!</h1>`,
    });
  } catch (error) {
    console.error(error);
  }
};

// ------ Login ------
exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage,
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return await res.redirect("/login");
    }

    const isPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordsMatch) {
      req.flash("error", "Inavalid credentials"); // setup message by key
      return await res.redirect("/login");
    }

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
