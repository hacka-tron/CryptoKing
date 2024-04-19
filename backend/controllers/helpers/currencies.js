const https = require('https');

const requestOptions = {
  method: 'GET',
  hostname: 'pro-api.coinmarketcap.com',
  path: '/v1/cryptocurrency/listings/latest?start=1&limit=100&convert=USD',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_KEY
  }
};

//Returns a callback which gives an array of coin data
exports.getCurrencies = function (callback) {
  https.request(requestOptions, (res) => {
    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        return callback(response.data);
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
  }).on("error", (err) => {
    console.log('API call error:', err.message);
  }).end();
}

//Returns the price of a given currency in the list of currencies
exports.getCoinPrice = function (id, currencies) {
  if (id != 0) {
    const coinInfo = currencies.find(coin => {
      return coin.id === id;
    });
    return coinInfo.quote.USD.price;
  }
  //if the coin isnt in the list of currencies, return -1
  return -1;
}