import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Avatar from "../ui/Avatar";
import styles from "./ChatItem.module.css";
import edit from "./../assets/edit.svg";
import remove from "./../assets/delete.svg";
import { deleteChat, editChat, fetchChatById } from "../slices/chatSlice";
import { fetchMessagesByChatId } from "../slices/messageSlice";

function ChatItem({ chat }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const messageStatus = useSelector((state) => state.message.status);

  const [isOpen, setIsOpen] = useState(false);
  const [updateChat, setUpdateChat] = useState(false);
  const [firstName, setFirstName] = useState(chat.firstName);
  const [lastName, setLastName] = useState(chat.lastName);

  useEffect(() => {
    if (messageStatus === "idle") {
      dispatch(fetchMessagesByChatId(chat._id));
    }
  }, [chat._id, dispatch, messageStatus]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  const toggleDeletePopup = () => {
    setIsOpen(!isOpen);
  };
  const toggleEditPopup = () => {
    setUpdateChat(!updateChat);
  };
  const handleDeleteChat = () => {
    dispatch(deleteChat(chat._id));
    toggleDeletePopup();
  };

  const handleEditChat = () => {
    dispatch(
      editChat({ chatId: chat._id, updatedData: { firstName, lastName } })
    );
    toggleEditPopup();
  };
  const handleChatClick = () => {
    dispatch(fetchChatById(chat._id));
  };
  const truncateMessage = (message, wordLimit = 5) => {
    const words = message.split(" ");
    if (words.length > wordLimit) {
      return `${words.slice(0, wordLimit).join(" ")}...`;
    }
    return message;
  };

  if (messageStatus === "loading") return;
  return (
    <li className={styles.chatItem} onClick={handleChatClick}>
      <div className={styles.chatElem}>
        <Avatar />
        <p>
          <span>
            {chat.firstName} {chat.lastName}
          </span>

          <br />
          {messages[chat._id]?.length
            ? truncateMessage(
                messages[chat._id][messages[chat._id].length - 1].message
              )
            : "Start chatting...👋"}
        </p>
      </div>
      <div className={styles.chatElem}>
        <button className={styles.chatElemButton} onClick={toggleEditPopup}>
          <img src={edit} alt="edit" />
        </button>
        <button className={styles.chatElemButton} onClick={toggleDeletePopup}>
          <img src={remove} alt="delete" />
        </button>
        <p>
          {messages[chat._id]?.length
            ? formatDate(
                messages[chat._id][messages[chat._id].length - 1].timestamp
              )
            : ""}
        </p>

        {isOpen && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <h2>Do you want to delete chat with {chat.firstName}?</h2>
              <p>Note: you wouldn't be able to restore your dialog!</p>
              <div className={styles.buttons}>
                <button
                  className={`${styles.popupButton} ${styles.delete}`}
                  onClick={handleDeleteChat}
                >
                  Delete
                </button>
                <button
                  className={styles.popupButton}
                  onClick={toggleDeletePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {updateChat && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <h2>Edit chat ✍️</h2>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.chatEdit}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.chatEdit}
              />
              <div className={styles.buttons}>
                <button
                  className={`${styles.popupButton} ${styles.edit}`}
                  onClick={handleEditChat}
                >
                  Save changes
                </button>
                <button
                  className={styles.popupButton}
                  onClick={toggleEditPopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export default ChatItem;
