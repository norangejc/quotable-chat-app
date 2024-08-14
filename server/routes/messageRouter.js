const express = require("express");
const {getMessagesByChatId, sendMessage, updateMessage} = require("../controllers/messageController")

const router = express.Router();
router.route("/:chatId/").get(getMessagesByChatId).post(sendMessage)
router.route("/:messageId/").patch(updateMessage)

module.exports = router;
