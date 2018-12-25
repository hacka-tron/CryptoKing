const Coin = require("../models/coin");
const Wallet = require("../models/wallet");
const Currencies = require("./helpers/currencies");

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
    var coinsToBuy =
      req.body.cost / Currencies.getCoinPrice(req.body.id, currencies);
    Wallet.findOneAndUpdate(
      { _id: req.body.wallet },
      { $inc: { dollars: -req.body.cost } }
    ).then(wallet => {
      var updatedDollars = wallet.dollars - req.body.cost;
      Coin.findOneAndUpdate(
        { id: req.body.id, wallet: req.body.wallet },
        { $inc: { ammount: coinsToBuy } }
      ).then(updatedCoin => {
        if (updatedCoin) {
          res.status(201).json({
            message: "Coin bought succesfully",
            coin: updatedCoin,
            dollars: updatedDollars
          });
        } else {
          const coin = new Coin({
            id: req.body.id,
            ammount: coinsToBuy,
            wallet: req.body.wallet
          });
          coin.save().then(createdCoin => {
            res.status(201).json({
              message: "Coin bought succesfully",
              coin: createdCoin,
              dollars: updatedDollars
            });
          });
        }
      });
    });
  });
};

//Adds a new coin to the wallet, and subtracts the dollar value of that coin from the wallet dollars
exports.sellCoin = (req, res, next) => {
  Currencies.getCurrencies(function(currencies) {
    var cost =
      req.body.ammount * Currencies.getCoinPrice(req.body.id, currencies);
    Wallet.findOneAndUpdate(
      { _id: req.body.wallet },
      { $inc: { dollars: cost } }
    ).then(wallet => {
      var updatedDollars = wallet.dollars + cost;
      Coin.findOneAndUpdate(
        { id: req.body.id, wallet: req.body.wallet },
        { $inc: { ammount: -req.body.ammount } }
      ).then(updatedCoin => {
        res.status(201).json({
          message: "Coin Sold succesfully",
          coin: updatedCoin,
          dollars: updatedDollars
        });
      });
    });
  });
};
