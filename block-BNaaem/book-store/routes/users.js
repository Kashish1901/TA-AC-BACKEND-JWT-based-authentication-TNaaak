var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    console.log(user);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
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
    console.log(token);
    res.json({ user: user.userJSON(token) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;