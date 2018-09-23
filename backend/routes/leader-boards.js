const express = require("express");

const LeaderBoardsController = require("../controllers/leader-boards");

const router = express.Router();

router.get("", LeaderBoardsController.getLeaderBoard)

module.exports = router;
