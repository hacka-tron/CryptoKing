const Coin = require("../models/coin");

//Gets a list of all coins in database
exports.getCoins = (req, res, next) => {
  Coin.find({ creator: req.userData.email }).then(documents => {
    res.status(200).json({
      messsage: "Coins fetched succsfully",
      coins: documents
    });
  });
};

//Gets a specified coin from the database
exports.getCoin = (req, res, next) => {
  Coin.findOne({ id: req.params.id, creator: req.userData.email }).then(
    coin => {
      if (coin) {
        res.status(200).json(coin);
      } else {
        res.status(404).json({ message: "Coin not found!" });
      }
    }
  );
};

//Adds a new coin to the database
exports.newCoin = (req, res, next) => {
  const coin = new Coin({
    id: req.body.id,
    ammount: req.body.ammount,
    creator: req.userData.email
  });
  coin.save().then(result => {
    res.status(201).json({
      message: "Coin added successfully!",
      coin: result
    });
  });
};

//Update the value of a coin in a database
exports.updateCoin = (req, res, next) => {
  const coin = {
    ...req.body,
    creator: req.userData.email
  };
  Coin.updateOne({ id: req.body.id, creator: req.userData.email }, coin)
    .then(result => {
      res.status(200).json({
        message: "Update success",
        coin: coin
      });
    })
    .catch(error => {
      console.log(error);
    });
};
