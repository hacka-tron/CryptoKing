const User = require("../models/user");
const Wallet = require("../models/wallet");
const Coin = require("../models/coin");

const WalletHelper = require("./helpers/wallet");

//Gets a list of all wallets in database that belong to the current user
exports.getWallets = (req, res, next) => {
  Wallet.find({ owner: req.userData.userId }).then(wallets => {
    let walletIds = wallets.map(wallet => wallet._id);
    Coin.find({ wallet: walletIds }).then(coins => {
      const walletArray = WalletHelper.createWalletArray(wallets, coins);
      res.status(200).json({
        messsage: "Wallets fetched succsfully",
        walletArray: walletArray
      });
    });
  });
};

exports.getActiveWallet = (req, res, next) => {
  User.findById(req.userData.userId).then(user => {
    Wallet.findById(user.curWallet)
      .then(wallet => {
        res.status(200).json({
          message: "Wallet Found!",
          wallet: wallet
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Couldn't Find Wallet"
        });
      });
  });
};

exports.getCurDollars = (req, res, next) => {
  User.findById(req.userData.userId).then(user => {
    Wallet.findById(user.curWallet)
      .then(wallet => {
        res.status(200).json({
          message: "Dollars Found!",
          dollars: wallet.dollars
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Couldn't Find Dollars"
        });
      });
  });
};

//Gets a specified wallet from the database belonging to the current user
exports.getWallet = (req, res, next) => {
  Wallet.findOne({ id: req.params.id, creator: req.userData.userId }).then(
    wallet => {
      if (wallet) {
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

exports.removeWallet = (req, res, next) => {
  Wallet.find({owner: req.userData.userId}).then(wallets => {
    if (wallets.length > 1) {
      Coin.deleteMany({ wallet: req.params.id }).then(deleted => {
        Wallet.findOneAndDelete({ _id: req.params.id }).then(response => {
          Wallet.findOne().then(wallet =>{
            User.updateOne(
              { _id: req.userData.userId },
              { $set: { curWallet: wallet._id } }
            ).then(updatedUser => {
              res.status(200).json({
                message: "Wallet deleted sucessfully!"
              });
            });
          })
        });
      });
    }
  });
};

///Update the name of a wallet in the database belonging to the current user
exports.updateName = (req, res, next) => {
  Wallet.updateOne({ _id: req.params.id }, { $set: { name: req.body.name } })
    .then(result => {
      res.status(200).json({
        message: "Update success"
      });
    })
    .catch(error => {
      console.log(error);
    });
};
