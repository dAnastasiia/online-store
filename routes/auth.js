const { Router } = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = Router();

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
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
      }),
    body("password", "Invalid password").isLength({ min: 5 }).isAlphanumeric(),
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
    body("email").isEmail().withMessage("Invalid email"),
    body("password", "Invalid password").isLength({ min: 5 }).isAlphanumeric(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

module.exports = router;
