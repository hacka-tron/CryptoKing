const express = require("express");

const CoinController = require("../controllers/coins");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("", checkAuth, CoinController.getCoins);

router.get("/:id", checkAuth, CoinController.getCoin);

router.post("", checkAuth, CoinController.buyCoin);

module.exports = router;
