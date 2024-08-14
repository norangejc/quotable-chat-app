const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "A chat must have a first name"],
    },
    lastName: {
      type: String,
      required: [true, "A caht must have a last name"],
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
