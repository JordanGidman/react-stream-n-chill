import { nanoid } from "nanoid";
import { cache } from "./cache";

export const room = {
  roomExists(roomId) {
    const roomIds = cache.rooms.map((activeRoom) => activeRoom.roomId);
    return roomIds && roomIds.indexOf(roomId) !== -1;
  },

  getRoomById(roomId) {
    return cache.rooms.find(
      (activeRoom) => activeRoom.roomId && activeRoom.roomId === roomId
    );
  },

  createRoom(socket, video) {
    // at some point we will make the id its position in the database but for now i will use nanoid
    let roomId = nanoid(6);

    //Add a new room to the rooms arr
    cache.rooms.push({
      roomId,
      selectedVideo: video,
      videoPlayer: {
        playerState: "paused",
        timeInVideo: 0,
        lastStateChange: null,
      },
      videoPlayerInterval: null,
      usersInRoom: [],
      messagesInRoom: [],
    });

    return roomId;
  },

  getSelectedVideo(roomId) {
    const roomForId = room.getRoomById(roomId);

    return roomForId && roomForId.selectedVideo ? roomForId.selectedVideo : {};
  },

  getVideoPlayer(roomId) {
    const roomForId = room.getRoomById(roomId);

    return roomForId && roomForId.videoPlayer ? roomForId.videoPlayer : {};
  },

  getUsersForRoom(roomId) {
    const roomForId = room.getRoomById(roomId);

    const userIdsInRoom = roomForId ? roomForId.usersInRoom : [];

    const usersInRoom = userIdsInRoom.map((userId) => {
      return user.getUserForId(userId);
    });

    return usersInRoom;
  },

  getMessagesInRoom(roomId) {
    const roomForId = cache.parties.find(
      (activeroom) => activeroom.roomId === roomId
    );

    return roomForId && roomForId.messagesInroom
      ? roomForId.messagesInroom
      : [];
  },

  sendRoomDetailsToClient(socket, roomId) {
    if (!room.roomExists(roomId)) {
      return false;
    }

    //Get video details
    const videoForRoom = room.getSelectedVideo(roomId);
    //Get video state
    const videoPlayer = room.getVideoPlayer(roomId);
    const usersInRoom = room.getUsersForRoom(roomId);
    const messagesInRoom = room.getMessagesInRoom(roomId);

    //Then im not sure how yet but i need to let the client know the video and the videoPlayer state e.g. "playing"
    //As well as the users in the room
    //And then the messages in the room
  },

  sendMessageToRoom(message, roomId, userName) {
    //Get all messages
    const messagesInCurrentRoom = room.getMessagesInRoom(roomId);
    const messagesWithUserName = { message, userName, roomId };

    //Add a new message to the array
    messagesInCurrentRoom.push(messagesWithUserName);

    //Emit all messages in the room to all clients in the current room. Again im not sure how yet.
  },

  toggleVideoPlayerInterval(roomId, turnOn) {
    const roomForId = room.getRoomById(roomId);
    const videoPlayer = room.getVideoPlayer(roomId);

    //Start tracking the time while video is playing
    if (turnOn && !roomForId.videoPlayerInterval) {
      if (!roomForId.videoPlayerInterval) {
        roomForId.videoPlayerInterval = setInterval(() => {
          videoPlayer.timeInVideo += 1;
        }, 1000);
      }
    } else if (roomForId.videoPlayerInterval) {
      //Clear the existing interval
      clearInterval(roomForId.videoPlayerInterval);
      roomForId.videoPlayerInterval = null;
    }
  },

  playVideoForRoom(roomId, videoPlayerState) {
    //Stop the player interval
    room.toggleVideoPlayerInterval(roomId, false);

    //Emit the pause event to all clients. Not sure how yet.
  },

  pauseVideoForRoom(roomId, videoPlayerState) {
    //Stop the player interval
    room.toggleVideoPlayerInterval(roomId, false);

    //Emit the pauseVideo event to all clients
  },

  onNewPlayerStateForRoom(io, socket, roomId, newPlayerState) {
    const roomForId = room.getRoomById(roomId);

    //Clear the current video interval for this room
    room.toggleVideoPlayerInterval(roomId, false);

    const newVideoPlayerStateForRoom = {
      lastStateChange: socket.id,
      playerState: newPlayerState.playerState,
      timeInVideo: newPlayerState.timeInVideo,
    };

    //Set the new videoPlayer state in the room object
    roomForId.videoPlayer = newVideoPlayerStateForRoom;

    //Play/Pause the video for all users in the room
    if (newPlayerState.playerState === "playing") {
      room.playVideoForRoom(io, roomId);
    } else {
      room.pauseVideoForRoom(io, roomId);
    }
  },
};
