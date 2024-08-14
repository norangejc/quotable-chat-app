const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { validateParam } = require("../utils/validateParam");

exports.getMessagesByChatId = catchAsync(async (req, res, next) => {
  const chatId = req.params.chatId;
  validateParam(chatId, Chat);
  const messages = await Message.find({ chatId }).sort("timestamp");
  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const chatId = req.params.chatId;
  const { sentByMe, message } = req.body;
  const chat = await validateParam(chatId, Chat);
  const sentMessage = await Message.create({ chatId, sentByMe, message });
  chat.messages.push(sentMessage._id);
  await chat.save();
  res.status(200).json({
    status: "success",
    data: {
      message: sentMessage,
    },
  });
});

exports.updateMessage = catchAsync(async (req, res, next) => {
  const messageId = req.params.messageId;
  const { message } = req.body;
  const messageToUpdate = await validateParam(messageId, Message);

  if (!messageToUpdate.sentByMe) {
    return next(new AppError("You can only update your messages!", 400));
  }
  messageToUpdate.message = message;
  await messageToUpdate.save();
  res.status(200).json({
    status: "success",
    message: "Message was updated successfully",
    data: {
      message: messageToUpdate,
    },
  });
});
