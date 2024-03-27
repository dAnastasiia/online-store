const { Router } = require("express");

const authController = require("../controllers/auth");

const router = Router();

router.get("/login", authController.getLogin);

module.exports = router;
