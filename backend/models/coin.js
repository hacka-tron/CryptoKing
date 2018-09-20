const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const coinSchema = mongoose.Schema({
  id: { type: Number, required: true },
  ammount: { type: Number, required: true, min: 0 },
  creator: { type: String, ref: "User", required: true }
});

module.exports = mongoose.model("Coin", coinSchema);
