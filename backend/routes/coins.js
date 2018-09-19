const express = require("express");

const CoinController = require ("../controllers/coins");

const router = express.Router();

router.get("", CoinController.getCoins);

router.get("/:id", CoinController.getCoin)

router.post("", CoinController.newCoin);

router.put("", CoinController.updateCoin);

module.exports = router;
