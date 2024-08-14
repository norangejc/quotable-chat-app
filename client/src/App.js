import Chat from "./components/Chat";
import ChatList from "./components/Sidebar";

function App() {
  return (
    <div className="container">
      <ChatList />
      <Chat />
    </div>
  );
}

export default App;
