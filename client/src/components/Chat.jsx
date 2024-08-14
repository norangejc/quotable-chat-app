import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesByChatId, sendMessage } from "../slices/messageSlice";
import styles from "./Chat.module.css";
import Avatar from "../ui/Avatar";
import { useEffect, useState } from "react";
import send from "./../assets/send-arrow.svg";

const QOUTABLE_API = "https://api.quotable.io/random";

function Chat() {
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat.selectedChat || []);
  const chatStatus = useSelector((state) => state.chat.status);
  const messages = useSelector(
    (state) => state.message.messages[chat._id] || []
  );
  const messageStatus = useSelector((state) => state.message.status);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      dispatch(
        sendMessage({
          chatId: chat._id,
          message: { message: newMessage, sentByMe: true },
        })
      );
      setNewMessage("");
      handleQuotableAnswer();
    }
  };
  const handleQuotableAnswer = async () => {
    try {
      const response = await fetch(QOUTABLE_API);
      const data = await response.json();
      setTimeout(() => {
        dispatch(
          sendMessage({
            chatId: chat._id,
            message: { message: data.content, sentByMe: false },
          })
        );
      }, 3000);
    } catch (error) {
      console.error("Error getting answer from quotable api", error.message);
    }
  };
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(true);
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")}${period}`;

    return `${formattedDate} ${formattedTime}`;
  }

  if (chat.length === 0)
    return (
      <div className={styles.noChatMessages}>
        Choose chat to open dialog ✋{" "}
      </div>
    );
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <Avatar />
        <p>{chat.firstName}</p>
        <p>{chat.lastName}</p>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div key={index} className={styles.messageList}>
            <p
              className={
                message.sentByMe
                  ? styles.messageBubbleYou
                  : styles.messageBubble
              }
            >
              {message.message}
            </p>
            <p
              className={
                message.sentByMe ? styles.messageTimeYou : styles.messageTime
              }
            >
              {formatDate(message.timestamp)}
            </p>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message"
        />
        <img src={send} alt="Send icon" />
      </div>
    </div>
  );
}

export default Chat;
