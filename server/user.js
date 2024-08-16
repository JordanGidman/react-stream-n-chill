import { cache } from "./cache";

export const user = {
  getUserForId(socketId) {
    return cache.users.find((activeUser) => activeUser.socketId === socketId);
  },

  userExists(socketId) {
    return !!user.getUserForId(socketId);
  },

  createNewUser(userId, userName) {
    if (!user.userExists(userId)) {
      const newUser = {
        socketId: userId,
        userName,
        readyToPlayState: {
          clientIsReady: false,
          timeInVideo: 0,
        },
      };
      cache.users.push(newUser);
    }
  },

  addUserToRoom(io, socket, roomId) {
    const roomForId = room.getRoomById(roomId);
    const socketId = socket.id;

    //Make sure user isnt in any other rooms
    user.removeUserFromRooms(io, socket);

    //Add the users socketId to the room
    roomForId.usersInParty.push(socketId);

    //Connect the user to the room through socket.io's room
    socket.join(roomId);
  },

  getRoomIdForUser: (socketId) => {
    const roomIdsForUser = cache.rooms
      .filter((activeroom) => {
        return activeroom.usersInroom.find((userId) => userId === socketId);
      })
      .map((activeroom) => activeroom.roomId);

    return roomIdsForUser && roomIdsForUser.length ? roomIdsForUser[0] : null;
  },

  removeUserFromRooms: (io, socket) => {
    const socketId = socket.id;

    // Make sure the user isn't in any server managed rooms anymore
    cache.rooms.forEach((activeParty) => {
      activeParty.usersInParty = activeParty.usersInParty.filter((userId) => {
        return userId !== socketId;
      });
    });

    // Disconnect the socket from the rooms / rooms managed by socketIo
    user.leaveSocketIoRooms(io, socket);
  },

  disconnectFromRoom(io, socket) {
    const userId = socket.id;
    const roomForId = user.getRoomIdForUser(userId);
    user.removeUserFromRooms(io, socket);

    //Notify users that a user has left
  },

  resetPlayerStateForUser(socket) {
    //I need to reset the player state to paused and the timeInVideo to 0
  },

  resetSelectedVideoForUser(socket) {
    // reset the id, title, description, thumbnail, and videoSource to ""
  },

  resetClientToInitialState(socket) {
    //A simpler function to do both
    user.resetPlayerStateForUser(socket);
    user.resetSelectedVideoForUser(socket);
  },
};
