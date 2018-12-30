const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Wallet = require("../models/wallet");

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
      .then(createdUser => {
        const wallet = new Wallet({
          owner: createdUser._id,
          name: "Default",
          dollars: 1000
        });
        wallet.save().then(createdWallet => {
          User.updateOne(
            { _id: createdUser._id },
            { curWallet: createdWallet._id },
            { upsert: true }
          ).then(finishedUser => {
            res.status(201).json({
              message: "User Created",
              user: createdUser
            });
          });
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
        { email: fetchedUser.email, userId: fetchedUser._id },
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

exports.changeCurWallet = (req, res, next) => {
  User.updateOne(
    { _id: req.userData.userId },
    { $set: { curWallet: req.body.walletId } }
  ).then(updatedUser => {
    res.status(200).json({
      message: "User curWallet set successfully",
      curWalletId: req.body.walletId
    });
  });
};
