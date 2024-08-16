import { useRef, useState } from "react";

function VideoPlayer() {
  const playerRef = useRef(null);
  const [time, setTime] = useState(0);

  function onPlayerStateChange() {
    setTime(playerRef.current.getCurrentTime());
    console.log(playerRef.current);

    console.log(time);
  }

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => {
    playerRef.current = new window.YT.Player("player", {
      videoId: "Kp7eSUU9oy8", // Default video ID, will be dynamic
      playerVars: { start: 0, autoplay: 1, controls: 1 },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  };
  return <div id="player"></div>;
}

export default VideoPlayer;
