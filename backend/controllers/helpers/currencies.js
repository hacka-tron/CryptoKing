const request = require("request-promise");

const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '100',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_KEY
  },
  json: true,
  gzip: true
};



//Returns a callback which gives an array of coin data
exports.getCurrencies = function(callback) {
  request(requestOptions).then(response => {
  return callback(response.data);
}).catch((err) => {
  console.log('API call error:', err.message);
});
};

//Returns the price of a given currency in the list of currencies
exports.getCoinPrice = function(id, currencies) {
  if (id != 0) {
    var coinInfo = currencies.find(coin => {
      return coin.id === id;
    });
    return coinInfo.quote.USD.price;
  }
  //if the coin isnt in the list of currencies, return -1
  return -1;
}

//Returns the price of a given currency in the list of currencies
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