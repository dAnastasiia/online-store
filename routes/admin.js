const { Router } = require("express");

const router = Router();

router.get("/add-user", (req, res, next) => {
  res.send(
    "<form action='/admin/add-user' method='POST'><input type='text' name='name' /><button type='submit'>Add User</button></form>"
  );
});

router.post("/add-user", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
