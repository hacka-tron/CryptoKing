const Coin = require("../models/coin");
const Wallet = require("../models/wallet");
const User = require("../models/user");
const Currencies = require("./helpers/currencies");
const WalletHelper = require("./helpers/wallet");

//Returns the position of the user with the given userName in the leaderBoard
function userPos(userName, leaderBoard) {
  for (i = 0; i < leaderBoard.length; i++) {
    if (leaderBoard[i].userName == userName) {
      return i;
    }
  }
  return -1;
}

function findUserByWallet(walletOwner, users) {
  var user = users.find(user => {
    return walletOwner == user._id;
  });
  if (user) {
    return user.userName;
  }
  return undefined;
}
exports.getLeaderBoard = (req, res, next) => {
  User.find().then(users => {
    Wallet.find().then(wallets => {
      Coin.find().then(coins => {
        Currencies.getCurrencies(currencies => {
          var walletInfo = [];
          const leaderBoard = [];
          for (wallet of wallets) {
            walletCoins = coins.filter(coin => coin.wallet == wallet._id);
            walletInfo.push([
              wallet.owner,
              WalletHelper.getWalletValue(wallet.dollars, walletCoins, currencies)
            ]);
          }
          for (wallet of walletInfo) {
            leaderBoard.push({
              userName: findUserByWallet(wallet[0], users),
              walletWorth: wallet[1]
            });
          }
          leaderBoard.sort((wallet1, wallet2) =>{return wallet2.walletWorth-wallet1.walletWorth})
          for (var i =0; i<leaderBoard.length;i++){
            leaderBoard[i]["rank"] = i+1
          }
          if (leaderBoard) {
            res.status(200).json({ leaderBoard: leaderBoard });
          } else {
            res.status(404).json({ message: "Leaderboard Not Created!" });
          }
        });
      });
    });
  });
};
