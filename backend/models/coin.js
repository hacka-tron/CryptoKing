const mongoose = require('mongoose');

const coinSchema = mongoose.Schema({
  id: {type: Number, required: true},
  ammount: {type: Number, required: true}
})

module.exports = mongoose.model('Coin', coinSchema);
