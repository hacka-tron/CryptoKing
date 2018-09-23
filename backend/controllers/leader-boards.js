const Coin = require("../models/coin");
const User = require("../models/user");

const request = require("request");

//Returns the position of the user with the given userName in the leaderBoard
function userPos(userName, leaderBoard) {
  for (i = 0; i < leaderBoard.length; i++) {
    if (leaderBoard[i].userName == userName) {
      return i;
    }
  }
  return -1;
}

//Returns a callback which gives an array of coin data
function getCurrencies(callback) {
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
function getCoinPrice(id, currencies) {
  if (id != 0) {
    var coinInfo = currencies.find(coin => {
      return coin.id === id;
    });
    return coinInfo.quotes.USD.price;
  }
  //in the case where id=0, we know that the coin is a dollar so the value should be 1
  return 1;
}

function findUserNameByEmail(email, users) {
  var user = users.find(user => {
    return user.email === email;
  });
  if (user) {
    return user.userName;
  }
  return undefined;
}
exports.getLeaderBoard = (req, res, next) => {
  Coin.find().then(coins => {
    User.find().then(users => {
      getCurrencies(function(currencies) {
        const leaderBoard = [];
        for (coin of coins) {
          const userName = findUserNameByEmail(coin.creator, users);
          const curPos = userPos(userName, leaderBoard);
          const coinPrice = getCoinPrice(coin.id, currencies);
          coinValue = coin.ammount * coinPrice;
          if (curPos == -1) {
            leaderBoard.push({ userName: userName, netWorth: coinValue });
          } else {
            leaderBoard[curPos].netWorth += coinValue;
          }
        }
        leaderBoard.sort(function(a, b) {
          return b.netWorth - a.netWorth;
        });
        for(let i=0; i<leaderBoard.length; i++){
          leaderBoard[i].rank = i+1;
        }

        if (leaderBoard) {
          res.status(200).json({ leaderBoard: leaderBoard });
        } else {
          res.status(404).json({ message: "Leaderboard Not Created!" });
        }
      });
    });
  });
};
