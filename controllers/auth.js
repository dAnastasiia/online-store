const User = require("../models/user");

const userId = process.env.TEST_USER_ID;

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

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.error(error);
    res.redirect("/");
  });
};
