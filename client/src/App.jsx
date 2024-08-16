import { useEffect, useRef } from "react";
import ChatBox from "./components/ChatBox";
import VideoPlayer from "./components/VideoPlayer";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const playerRef = useRef(null);

  useEffect(() => {
    // Listen for syncTime events from the server
    socket.on("syncTime", (time) => {
      if (playerRef.current) {
        console.log(time);

        playerRef.current.seekTo(time);
      }
    });
  }, []);

  function handleTimeUpdate(time) {
    // Emit the current time to the server
    socket.emit("updateTime", time);
  }
  return (
    <div>
      <VideoPlayer
        videoId={"Kp7eSUU9oy8"}
        playerRef={playerRef}
        onTimeUpdate={handleTimeUpdate}
      />
      <ChatBox />
    </div>
  );
}

export default App;
