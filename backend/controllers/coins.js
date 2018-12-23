const Coin = require("../models/coin");

const Currencies = require("./helpers/currencies");
const Dollar = require("./helpers/wallet");

//Gets a list of all coins in a specified wallet
exports.getCoins = (req, res, next) => {
  Coin.find({ wallet: req.body.wallet }).then(coins => {
    res.status(200).json({
      messsage: "Coins fetched succsfully",
      coins: coins
    });
  });
};

//Gets the specified coin from the specified wallet
exports.getCoin = (req, res, next) => {
  Coin.findOne({ id: req.params.id, wallet: req.body.wallet }).then(coin => {
    if (coin) {
      res.status(200).json({ message: "Coin fetched sucessfully", coin: coin });
    } else {
      res.status(404).json({ message: "Coin not found!" });
    }
  });
};

//Adds a new coin to the wallet, and subtracts the dollar value of that coin from the wallet dollars
exports.buyCoin = (req, res, next) => {
  Currencies.getCurrencies(function(currencies) {
    coinsToBuy = req.body.cost/Currencies.getCoinPrice(req.body.id, currencies);
    Dollar.updateDollars(-req.body.cost, function() {
      Coin.findOneAndUpdate(
        { id: req.body.id, wallet: req.body.wallet },
        { $inc: { ammount: coinsToBuy } }
      ).then(updatedCoin => {
        if (updatedCoin) {
          res.status(201).json({
            message: "Coin bought succesfully",
            coin: updatedCoin
          });
        } else {
          const coin = new Coin({
            id: req.body.id,
            ammount: req.body.ammount,
            wallet: req.body.wallet
          });
          coin.save().then(createdCoin => {
            res.status(201).json({
              message: "Coin bought succesfully",
              coin: createdCoin
            });
          });
        }
      });
    });
  });
};
