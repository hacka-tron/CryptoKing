const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const coinSchema = mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  ammount: {type: Number, required: true},
  //creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
})

coinSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Coin', coinSchema);
