const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Coin = require("./models/coin");

const app = express();

mongoose
  .connect(
    "mongodb+srv://Dude:n3T3K3IwRrujlZ95@cluster0-yianf.mongodb.net/crypto-data?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get("/api/coins", (req, res, next) => {
  Coin.find().then(documents => {
    res.status(200).json({
      messsage: "Coins fetched succsfully",
      coins: documents
    });
  });
});

app.post("/api/coins", (req, res, next) => {
  const coin = new Coin({
    id: req.body.id,
    ammount: req.body.ammount
  });
  console.log(coin);
  coin.save();
  res.status(201).json({
    message: "Coin added successfully!",
    coin: coin
  });
});

app.put("/api/coins", (req, res, next) => {
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
module.exports = app;
