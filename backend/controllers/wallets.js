const Coin = require("../models/coin");
const Wallet = require("../models/wallet");


//Gets a list of all wallets in database that belong to the current user
exports.getWallets = (req, res, next) => {
  Wallet.find({ owner: req.userData.userId }).then(wallets => {
    res.status(200).json({
      messsage: "Coins fetched succsfully",
      wallets: wallets
    });
  });
};

//Gets a specified wallet from the database belonging to the current user
exports.getWallet = (req, res, next) => {
  Coin.findOne({ id: req.params.id, creator: req.userData.userId }).then(
    coin => {
      if (coin) {
        res.status(200).json(wallet);
      } else {
        res.status(404).json({ message: "Wallet not found!" });
      }
    }
  );
};

//Adds a new wallet to the database belonging to the current user
exports.createWallet = (req, res, next) => {
  const wallet = new Wallet({
    owner: req.userData.userId,
    name: req.body.name,
    dollars: req.body.dollars
  });
  wallet.save().then(wallet => {
    res.status(201).json({
      message: "Wallet created successfully!",
      wallet: wallet
    });
  });
};

//Update the value of a wallet in the database belonging to the current user
exports.updateDollars = (req, res, next) => {
  Wallet.updateOne({ _id: req.body.id }, {"$inc": {dollars: req.body.dollars }})
    .then(result => {
      res.status(200).json({
        message: "Update success"
      });
    })
    .catch(error => {
      console.log(error);
    });
};
