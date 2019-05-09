const express = require("express");

const CMCController = require("../controllers/cmc");

const router = express.Router();

router.get("", CMCController.getCurrencyList);

module.exports = router;