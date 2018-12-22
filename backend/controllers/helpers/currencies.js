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
}

//Returns the price of a given currency in the list of currencies
exports.getCoinPrice = function(id, currencies) {
  if (id != 0) {
    var coinInfo = currencies.find(coin => {
      return coin.id === id;
    });
    return coinInfo.quotes.USD.price;
  }
  //if the coin isnt in the list of currencies, return -1
  return -1;
}
