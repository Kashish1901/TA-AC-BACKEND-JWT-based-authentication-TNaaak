var express = require("express");
var router = express.Router();
var User = require("../models/User");
var auth = require("../middelwares/auth");
/* GET users listing. */
router.get("/", auth.verifyToken, async (req, res, next) => {
  try {
    var user = await User.findOne({});
    res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email/Password required" });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not registered " });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    var user = await User.findByIdAndUpdate(id, req.body);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
