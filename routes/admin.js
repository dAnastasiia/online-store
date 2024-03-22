const { Router } = require("express");

const router = Router();

router.get("/add-user", (req, res, next) => {
  res.send(
    "<form action='/user' method='POST'><input type='text' name='name' /><button type='submit'>Add User</button></form>"
  );
});

router.post("/user", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
