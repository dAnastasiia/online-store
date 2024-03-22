const path = require("path");

const { Router } = require("express");

const router = Router();

router.get("/", (req, res, next) => {
  const fileLocation = path.join(__dirname, "..", "views", "shop.html");
  res.sendFile(fileLocation);
});

module.exports = router;
