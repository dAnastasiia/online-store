const { Router } = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = Router();

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("name", "Name is too short").isAlpha().isLength({ min: 6 }),
    check("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (email) => {
        try {
          const isUserExist = await User.findOne({ email });

          if (isUserExist) {
            return Promise.reject("Email is already in use");
          }

          // resolve without rejection means true;
        } catch (error) {
          console.error(error);
        }
      })
      .normalizeEmail(),
    body("password", "Invalid password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword", "Passwords have to match").custom(
      (value, { req: { password } }) => value === password
    ),
  ],
  authController.postSignup
);

router.get("/reset-password", authController.getReset);
router.post("/reset-password", authController.postReset);

router.get("/set-password/:token", authController.getPassword);
router.post("/set-password", authController.postPassword);

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password", "Invalid password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

module.exports = router;
