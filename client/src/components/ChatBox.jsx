import { useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function ChatBox() {
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function sendMessage() {
    socket.emit("send_message", message);
  }

  return (
    <div className="chat-box">
      <div className="messages"></div>
      <input placeholder="message..." value={message} onChange={handleChange} />
      <button onClick={sendMessage}> Send Message</button>
    </div>
  );
}

export default ChatBox;
