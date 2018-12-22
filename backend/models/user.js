const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  curWallet: {type: String, ref: "Wallet"}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
