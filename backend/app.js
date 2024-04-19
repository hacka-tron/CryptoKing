const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const coinRoutes = require("./routes/coins");
const userRoutes = require("./routes/users");
const walletRoutes = require("./routes/wallets")
const leaderBoardRoutes = require("./routes/leader-boards");
const cmcRoutes = require("./routes/cmc");

const app = express();

const db_name = process.env.MONGO_DB_NAME

const prod_uri = `mongodb+srv://${process.env.MONGO_PROD_USER}:${process.env.MONGO_PROD_PW}@cluster.${process.env.MONGO_CLUSTER_PATH}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_CLUSTER_NAME}`;

const dev_uri = `mongodb://localhost:${process.env.MONGO_LOCAL_PORT}/${db_name}?retryWrites=true`;

mongoose
  .connect(
    process.env.ENV == 'prod' ? prod_uri : dev_uri,
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection failed!");
  });

app.use(bodyParser.json());

//Set access controls so no errors show up
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/coins", coinRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboards", leaderBoardRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/cmc", cmcRoutes);

module.exports = app;
