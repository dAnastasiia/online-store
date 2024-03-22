const path = require("path");

const { Router } = require("express");

const rootDir = require("../utils/path,js");

const router = Router();

router.get("/add-product", (req, res, next) => {
  const fileLocation = path.join(rootDir, "views", "add-product.html");
  res.sendFile(fileLocation);
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
