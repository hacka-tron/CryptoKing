const Coin = require("../models/coin");

exports.getCoins = (req, res, next) => {
  Coin.find().then(documents => {
    res.status(200).json({
      messsage: "Coins fetched succsfully",
      coins: documents
    });
  });
};

exports.getCoin = (req, res, next) => {
  Coin.findOne({ id: req.params.id }).then(coin => {
    if (coin) {
      res.status(200).json(coin);
    } else {
      res.status(404).json({ message: "Coin not found!" });
    }
  });
};

exports.newCoin = (req, res, next) => {
  const coin = new Coin({
    id: req.body.id,
    ammount: req.body.ammount
  });
  coin.save();
  res.status(201).json({
    message: "Coin added successfully!",
    coin: coin
  });
};

exports.updateCoin = (req, res, next) => {
  const coin = {
    ...req.body
  };
  Coin.updateOne({ id: req.body.id }, coin).then(result => {
    res.status(200).json({
      message: "Update success",
      coin: coin
    });
  });
};
