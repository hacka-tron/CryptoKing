exports.createWalletArray = function(wallets, coins) {
  var walletsArray = [];
  for (wallet of wallets) {
    matchedCoins = [];
    for (coin of coins) {
      if (coin.wallet == wallet._id) {
        matchedCoins.push(coin);
      }
    }
    walletsArray.push([wallet, matchedCoins]);
  }
  return walletsArray;
};
