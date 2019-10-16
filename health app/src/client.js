const consts = require("./constants/socket");

/** CLIENT CONFIGURATION - connect to the server */
const socketIOClient = require("socket.io-client");

export const sendMessage = () => {
}

export default function() {
  let host = process.env.NODE_ENV === 'production' ?
      "YOUR URL HERE" : "localhost:4002"   
  let socket = socketIOClient.connect(host, {secure: true});
  console.log("client connected!")
  // Checks which host we're connected to (for troubleshooting);
  
  function registerHandler(onMessageReceived) {
      socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
      socket.off('message')
  }

  socket.on('error', function (err) {
      console.log('received socket error:')
      console.log(err)
  })

  function register(name, cb) {
      socket.emit('register', name, cb)
  }

  function join(chatroomName, cb){
      socket.emit('join', chatroomName, cb)
  }

  function leave(chatroomName, cb) {
      socket.emit('leave', chatroomName, cb)
  }

  function message(chatroomName, msg, cb){
      socket.emit('message', { chatroomName, message: msg}, cb)
  }
  
  function getChatrooms(cb) {
      socket.emit('chatrooms', null, cb)
  }

  function getAvailableUsers(cb) {
      socket.emit('availableUsers', null, cb)
  }

  function newChatroom(chatroomName, userFullName, firstMessage, cb) {
    socket.emit('newChatroom', chatroomName, userFullName, firstMessage, cb)
  }
  
  function disconnect() {
      socket.emit('disconnect', "disconnect me");
  }

  return {
      register,
      join,
      leave,
      message,
      getChatrooms,
      getAvailableUsers,
      registerHandler,
      unregisterHandler,
      newChatroom,
      disconnect
  }
}

// When deployed, connect to the hosted server, otherwise connect to local server
// Localhost port must match server
// let host =
//   process.env.NODE_ENV === "production" ? "YOUR URL HERE" : "localhost:4002";
// let socket = socketIOClient.connect(host, { secure: true });
// // Checks which host we're connected to (for troubleshooting);
// console.log("connected to " + host);

// socket.on(consts.MESSAGE, msg => {
//   console.log("Server says: " + msg);
// });

// export const sendMessage = (msg, callbackFunc) => {
//   socket.emit(consts.NEW_MESSAGE, msg);

//   socket.on(consts.ALL_MESSAGES, result => {
//     callbackFunc(result);
//   });
// };
