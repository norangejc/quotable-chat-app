import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.css";
import Avatar from "../ui/Avatar";
import search from "./../assets/search.svg";
import { createChat, fetchChats } from "../slices/chatSlice";

function Header() {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value.trim());
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      dispatch(fetchChats(searchValue));
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateChat = () => {
    dispatch(createChat({ firstName, lastName }));
    togglePopup();
  };

  return (
    <div className={styles.sidebar}>
      <Avatar />
      <button className={styles.addChat} onClick={togglePopup}>
        New Chat +
      </button>
      <div className={styles.search}>
        <img src={search} alt="search icon" />
        <input
          className={styles.searchInput}
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={"Search or start new chat"}
        />
      </div>

      {isOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>Create new chat 💬</h2>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.chatEdit}
              placeholder="First name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.chatEdit}
              placeholder="Last Name"
            />
            <div className={styles.buttons}>
              <button
                className={`${styles.popupButton} ${styles.edit}`}
                onClick={handleCreateChat}
              >
                Create chat
              </button>
              <button className={styles.popupButton} onClick={togglePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
