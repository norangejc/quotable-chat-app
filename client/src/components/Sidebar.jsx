import { useState } from "react";
import ChatList from "./ChatList";
import Header from "./Header";

function Sidebar() {
  const [search, setSearch] = useState('')
  return (
    <div>
      <Header onSetSearch={setSearch} />
      <ChatList search={search}/>
    </div>
  );
}

export default Sidebar;
