const path = require("path");

const { Router } = require("express");

const rootDir = require("../utils/path");

const router = Router();

router.get("/", (req, res, next) => {
  const fileLocation = path.join(rootDir, "views", "shop.html");
  res.sendFile(fileLocation);
});

module.exports = router;
