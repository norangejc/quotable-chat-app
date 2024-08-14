const express = require("express");
const {
  getAllChats,
  createChat,
  getChatById,
  updateChatInfo,
  deleteChat,
} = require("../controllers/chatController");

const router = express.Router();
router.route("/").get(getAllChats).post(createChat);
router.route("/:id/").get(getChatById).patch(updateChatInfo).delete(deleteChat);
module.exports = router;
