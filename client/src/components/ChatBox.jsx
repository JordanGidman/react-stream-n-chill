import { useEffect, useState } from "react";

function ChatBox() {
  const [backendData, setBackendData] = useState(null);
  console.log(backendData);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setBackendData(data);
      });
  }, []);

  return (
    <div className="chat-box">
      <div className="messages">
        {backendData === null ? (
          <p>Loading</p>
        ) : (
          backendData.map((data, i) => <p key={i}>{data}</p>)
        )}
      </div>
      <input placeholder="message..." />
      <button> Send Message</button>
    </div>
  );
}

export default ChatBox;
