const request = require("request");

exports.updateDollars = function(dollars) {
  var dollarOptions = {
    uri: "http://localhost3000/api/wallets",
    body: JSON.stringify({dollars: dollars}),
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  };
  request(dollarOptions, function(error, response, body) {
    return callback();
  });
};
