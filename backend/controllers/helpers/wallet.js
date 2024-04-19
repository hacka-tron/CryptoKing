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

exports.getWalletValue = (dollars, wallet, currencies) => {
  var totalValue = dollars;
  for (coin of wallet) {
    coinInfo = currencies.find(currency => {
      return currency.id == coin.id;
    });
    if (coinInfo) {
      totalValue += coin.ammount * coinInfo.quote.USD.price;
    }
  }
  return totalValue;
};