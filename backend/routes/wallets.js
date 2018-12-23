const express = require("express");

const WalletController = require("../controllers/wallets");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("", checkAuth, WalletController.getWallets);

router.get("/:id", checkAuth, WalletController.getWallet);

router.post("", checkAuth, WalletController.createWallet);

router.put("", checkAuth, WalletController.updateDollars);

router.get("/dollars", WalletController.getCurDollars)

//router.delete("/:id", checkAuth, WalletController.removeWallet)

module.exports = router;
