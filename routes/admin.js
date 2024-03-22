const path = require("path");

const { Router } = require("express");

const router = Router();

router.get("/add-product", (req, res, next) => {
  const fileLocation = path.join(__dirname, "..", "views", "add-product.html");
  res.sendFile(fileLocation);
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
