const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const coinSchema = mongoose.Schema({
  id: { type: Number, required: true },
  ammount: { type: Number, required: true, min: 0 },
  wallet: { type: String, ref: "Wallet", required: true }
});

coinSchema.index({ wallet: 1});
module.exports = mongoose.model("Coin", coinSchema);
