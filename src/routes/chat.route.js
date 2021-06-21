const express = require("express");

const router = express.Router();
const { fetchMessages } = require("../controllers/chat.controller");

router.get("/:senderId/:receiverId", fetchMessages);

module.exports = router;
