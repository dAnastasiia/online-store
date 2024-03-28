const crypro = require("node:crypto");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");

const { DEFAULT_CART, MILLISECONDS_IN_HOUR } = require("../utils/constants");
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

    EmailService.sendMail({
      from: "mailtrap@demomailtrap.com",
      to: email,
      subject: "You're just signed in",
      html: `<h1>${name}, welcome to system!</h1>`,
    });
    res.redirect("/login");
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

// ------ Reset password ------
exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/reset", {
    pageTitle: "Reset Pssword",
    path: "/reset-password",
    errorMessage,
  });
};

exports.postReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const token = crypro.randomBytes(32).toString("hex");
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "No account with such an email");
      return await res.redirect("/reset-password");
    }

    user.resetToken = token;
    user.resetTokenExp = Date.now() + MILLISECONDS_IN_HOUR;

    await user.save();

    EmailService.sendMail({
      from: "mailtrap@demomailtrap.com",
      to: email,
      subject: "Reset password",
      html: `
       <p>You requested password reset.</p>
       <p>Follow <a href="http://localhost:${process.env.PORT}/set-password/${token}" target="_blank">this link</a> to set the new password.</p>
       `,
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

exports.getPassword = async (req, res, next) => {
  const { token: resetToken } = req.params; // get url parameter

  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExp: { $gt: Date.now() }, // $gt — GREATER THAN special comparison syntax
    });

    if (!user) return res.redirect("/");

    res.render("auth/set-password", {
      pageTitle: "Set Password",
      path: "/set-password",
      errorMessage,
      userId: user._id.toString(),
      resetToken,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postPassword = async (req, res, next) => {
  const { password, userId: _id, resetToken } = req.body;

  try {
    const user = await User.findOne({
      _id,
      resetToken,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Link has been expired");
      return await res.redirect("/reset-password");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExp = null;

    await user.save();

    return res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
};
