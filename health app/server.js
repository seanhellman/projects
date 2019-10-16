const consts = require("./src/constants/socket");
const ClientManager = require('./ClientManager')
const ChatroomManager = require('./ChatroomManager')

const makeHandlers = require('./handlers')

/** SERVER CONFIGURATION */
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

/** FIREBASE CONFIGS FOR SERVER-SIDE **/
const firebase = require("firebase")

const firebaseConfig = {
  apiKey: "AIzaSyB5MHY_F0Z1b0xB1Q05SxCk0vIAaGtgWng",
  authDomain: "health-app-8529b.firebaseapp.com",
  databaseURL: "https://health-app-8529b.firebaseio.com",
  projectId: "health-app-8529b",
  storageBucket: "health-app-8529b.appspot.com",
  messagingSenderId: "506227198033",
  appId: "1:506227198033:web:9529de82818a8873"
}

firebase.initializeApp(firebaseConfig);

/** POPULATING CHATROOM & CLIENT-NAME LIST FROM F.STORE**/

var userTemplates = []
var userChatrooms = []

var clientManager = null;
var chatroomManager = null;


/** POPULATE CLIENT-NAME LIST */
const database = firebase.firestore();
database.collection("users")
.get()
.then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          userName = doc.data().firstName + ' ' + doc.data().lastName
          userTemplates.push({name: userName})
        })
        clientManager = ClientManager(userTemplates)
})

/** POPULATE CHATROOM LIST */
database.collection("chatrooms")
.get()
.then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          userChatrooms.push({name: doc.id, messages: doc.data().messages})
        })
        chatroomManager = ChatroomManager(userChatrooms)
})

// Choose a port, default is 4002 (could be almost anything)
const PORT = process.env.PORT || 4002;

app.use(express.static(path.join(__dirname, "build")));

// When on Heroku, serve the UI from the build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "build/index.html")));
  });
}

// When on local host, server from the public folder.
// Rule will not be written if production conditional has executed
app.get("*", (req, res) => {
  app.sendFile(path.join(__dirname + "public/index.html"));
});

// Listen for client connections
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

process.on('SIGINT', () => {
  console.log('Exiting program...Freeing port')
  process.exit()
})

io.on(consts.CONNECTION, client => {
  // Send messages to and receive messages from the client in here
  const {
      handleRegister,
      handleJoin,
      handleLeave,
      handleMessage,
      handleGetChatrooms,
      handleGetAvailableUsers,
      handleDisconnect,
      handleNewChatroom,
      handleSaveToFirebase
  } = makeHandlers(client, clientManager, chatroomManager)

  console.log('client connected...', client.id)

  clientManager.addClient(client)

  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('leave', (chatroomName, callback) => {
    handleLeave(chatroomName, callback);
    handleSaveToFirebase(firebase, chatroomName);
  })

  client.on('message', handleMessage)

  client.on('chatrooms', handleGetChatrooms)

  client.on('availableUsers', handleGetAvailableUsers)

  client.on('newChatroom', handleNewChatroom)

  client.on('disconnect', function () {
      console.log('client disconnect...', client.id)
      handleDisconnect()
  })

  client.on('error', function (err) {
      console.log('received error form client:', client.id)
      console.log(err)
  })
})