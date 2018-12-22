const Coin = require("../models/coin");
const Wallet = require("../models/wallet");

const Currencies = require("./helpers/currencies");
const Dollar = require("./helpers/dollar")
const WalletController = require("./wallets");

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
  const coin = new Coin({
    id: req.body.id,
    ammount: req.body.ammount,
    wallet: req.body.wallet
  });
  Currencies.getCurrencies(function(currencies) {
    price = Currencies.getCoinPrice(coin.id, currencies);
    Dollar.updateDollars(-price, function(){
      coin.save().then(coin => {
        res.status(201).json({
          message: "Coin added successfully!",
          coin: coin
        });
      });
    })
  });
};

//Update the value of a coin in a database
exports.updateCoin = (req, res, next) => {
  const coin = {
    ...req.body,
    creator: req.userData.email
  };
  Coin.updateOne({ id: req.body.id, creator: req.userData.email }, coin)
    .then(result => {
      res.status(200).json({
        message: "Update success",
        coin: coin
      });
    })
    .catch(error => {
      console.log(error);
    });
};
