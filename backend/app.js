const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const coinRoutes = require("./routes/coins");

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

app.use("/api/coins", coinRoutes);

module.exports = app;
