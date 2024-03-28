const { Router } = require("express");

const authController = require("../controllers/auth");

const router = Router();

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/reset-password", authController.getReset);
router.post("/reset-password", authController.postReset);

router.get("/set-password/:token", authController.getPassword);
router.post("/set-password", authController.postPassword);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
