var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookSchema = new Schema(
  {
    title: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
