var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
var jwt = require("jsonwebtoken");

var userSchema = new Schema(
  {
    username: { type: String, required: true, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    token: String,
    bio: String,
    image: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (err) {
    return err;
  }
};

userSchema.methods.signToken = async function () {
  var payload = { userId: this.id, email: this.email };
  try {
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (err) {
    return err;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    email: this.email,
    token: token,
    username: this.username,
    bio: this.bio,
    image: this.image,
  };
};
module.exports = mongoose.model("User", userSchema);
