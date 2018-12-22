const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const walletSchema = mongoose.Schema({
  owner: { type: String, ref: "User", required: true },
  name: {type: String, required: true},
  dollars: {type: Number, min: 0}
});

walletSchema.index({ owner: 1});
module.exports = mongoose.model("Wallet", walletSchema);
