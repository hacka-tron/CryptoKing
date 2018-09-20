const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Coin = require("../models/coin");

//Adds a user to the database
exports.createUser = (req, res, next) => {
  //Create a hash of the incoming password using bcrypt
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      userName: req.body.userName,
      password: hash
    });
    user
      .save()
      .then(result => {
        const initialDollar = new Coin({
          creator: req.body.email,
          id: 0,
          ammount: 1000
        });
        initialDollar.save();
        res.status(201).json({
          message: "User Created",
          result: result,
          initialDollar: initialDollar
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "The email or password you entered is incorrect!"
        });
      }
      console.log("Loged in!");
      const token = jwt.sign(
        { email: fetchedUser.email },
        "secret_should_be_different",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userName: fetchedUser.userName
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
};
