var express = require("express");
var router = express.Router();
var auth = require("../middelwares/auth");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/dashboard", auth.verifyToken, async (req, res, next) => {
  res.redirect("/api/users");
});

module.exports = router;
