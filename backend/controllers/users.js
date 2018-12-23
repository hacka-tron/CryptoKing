const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Coin = require("../models/coin");

const Wallet = require("./helpers/wallet")

//Adds a user to the database
exports.createUser = (req, res, next) => {
  //Create a hash of the incoming password using bcrypt
  bcrypt.hash(req.body.password, 10).then(hash => {
    Wallet.makeWallet(createdUser._id, "default", 1000, function(){
    const user = new User({
      email: req.body.email,
      userName: req.body.userName,
      password: hash
    });
    user
      .save()
      .then(createdUser => {

          res.status(201).json({
            message: "User Created",
            user: createdUser
          });
        })
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
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userName: fetchedUser.userName,
        userId: fetchedUser._id,
        activeWallet: fetchedUser.curWallet
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed!"
      });
    });
};


