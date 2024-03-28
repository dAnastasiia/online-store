const { Router } = require("express");

const authController = require("../controllers/auth");

const router = Router();

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
