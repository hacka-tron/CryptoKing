const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('Please work!!');
  next();
})

app.use((req, res, next) => {
  res.send('It worked!');
})

module.exports = app;
