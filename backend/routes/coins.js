const express = require("express");

const Coin = require("../models/coin");

const router = express.Router();

router.get("", (req, res, next) => {
  Coin.find().then(documents => {
    res.status(200).json({
      messsage: "Coins fetched succsfully",
      coins: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Coin.findOne({id: req.params.id}).then(coin => {
    if (coin) {
      res.status(200).json(coin);
    } else {
      res.status(404).json({ message: "Coin not found!" });
    }
  })
})

router.post("", (req, res, next) => {
  const coin = new Coin({
    id: req.body.id,
    ammount: req.body.ammount
  });
  coin.save();
  res.status(201).json({
    message: "Coin added successfully!",
    coin: coin
  });
});

router.put("", (req, res, next) => {
  const coin = {
    ...req.body
  };
  Coin.updateOne({ id: req.body.id }, coin).then(result => {
    res.status(200).json({
      message: "Update success",
      coin: coin
    });
  });
});

module.exports = router;
