import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChats } from "../slices/chatSlice";
import ChatItem from "./ChatItem";
import styles from "./ChatList.module.css";

function ChatList({ search }) {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const chatStatus = useSelector((state) => state.chat.status);

  useEffect(() => {
    if (chatStatus === "idle") {
      dispatch(fetchChats());
    }
  }, [chatStatus, dispatch]);

  if (!chats.length)
    return (
      <div className={styles.message}>You don't have any chats yet 🥱</div>
    );
  return (
    <>
      <p className={styles.title}>Chats</p>
      <ul className={styles.chats}>
        {chats.map((chat) => (
          <ChatItem chat={chat} key={chat._id} />
        ))}
      </ul>
    </>
  );
}

export default ChatList;
