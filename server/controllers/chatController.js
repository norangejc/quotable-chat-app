const Chat = require("../models/chatModel");
const catchAsync = require("../utils/catchAsync");
const { validateParam } = require("../utils/validateParam");

exports.getAllChats = catchAsync(async (req, res) => {
  const search = req.query.search;
  let query = {};
  if (search) {
    query = {
      $or: [
        { firstName: { $regex: new RegExp(search, "i") } },
        { lastName: { $regex: new RegExp(search, "i") } },
      ],
    };
  }

  const chats = await Chat.find(query);
  res.status(200).json({
    status: "success",
    results: chats.length,
    data: {
      chats,
    },
  });
});

exports.createChat = catchAsync(async (req, res, next) => {
  const { firstName, lastName } = req.body;
  const chat = await Chat.create({
    firstName,
    lastName,
  });

  res.status(201).json({
    status: "success",
    data: {
      chat,
    },
  });
});

exports.getChatById = catchAsync(async (req, res, next) => {
  const chat = await validateParam(req.params.id, Chat);
  res.status(200).json({
    status: "success",
    data: {
      chat,
    },
  });
});

exports.updateChatInfo = catchAsync(async (req, res, next) => {
  const chatId = req.params.id;
  const { firstName, lastName } = req.body;

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;

  validateParam(chatId, Chat);

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $set: updateData },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Chat updated successfully",
    data: {
      chat: updatedChat,
    },
  });
});

exports.deleteChat = catchAsync(async (req, res, next) => {
  const chatId = req.params.id;
  validateParam(chatId, Chat);
  const deleteChat = await Chat.findByIdAndDelete(chatId);
  res.status(200).json({
    status: "success",
    message: "Chat deleted successfully",
  });
});
