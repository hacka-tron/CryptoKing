const express = require("express");

const UserController = require("../controllers/users");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.put("/changeCurWallet", checkAuth, UserController.changeCurWallet)


module.exports = router;
