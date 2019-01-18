const request = require("request");

//Returns a callback which gives an array of coin data
exports.getCurrencies = function(callback) {
  request("https://api.coinmarketcap.com/v2/ticker/?structure=array", function(
    error,
    response,
    body
  ) {
    apiResponse = JSON.parse(body);
    return callback(apiResponse.data);
  });
};

//Returns the price of a given currency in the list of currencies
exports.getWalletValue = (dollars, wallet, currencies) => {
  var totalValue = dollars;
  for (coin of wallet) {
    coinInfo = currencies.find(currency => {
      return currency.id == coin.id;
    });
    if (coinInfo) {
      totalValue += coin.ammount * coinInfo.quotes.USD.price;
    }
  }
  return totalValue;
};
