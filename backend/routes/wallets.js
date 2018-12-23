const express = require("express");

const WalletController = require("../controllers/wallets");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("", checkAuth, WalletController.getWallets);

router.get("/dollars", checkAuth, WalletController.getCurDollars)

router.get("/:id", checkAuth, WalletController.getWallet);

router.post("", checkAuth, WalletController.createWallet);

router.put("", checkAuth, WalletController.updateDollars);



//router.delete("/:id", checkAuth, WalletController.removeWallet)

module.exports = router;
