const Chatroom = require('./Chatroom')
// const fire = require('./src/data/fbConfig')

// const database = fire.firestore()
// database.collection("chatrooms")
// .get()
// .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         chatroomData.push({name: doc.id, messages: doc.data().messages})
//     })
// }).catch(console.log("Chatroom data failed to load from Firestore"))


module.exports = function (userChatrooms) {
    let chatrooms = new Map(
        userChatrooms.map( c =>
            [c.name,
            Chatroom(c)
        ])
    )

    function createNewChatroom(chatroomName, userFullName, firstMessage) {
        chatrooms.set(chatroomName, Chatroom({
            name: chatroomName, 
            messages:[{message: firstMessage, user:{name: userFullName}}]}))
    }

    function removeClient(client) {
        chatrooms.forEach(c => c.removeUser(client))
    }

    function getChatroomByName(chatroomName) {
        return chatrooms.get(chatroomName)
    }

    function serializeChatrooms() {
        return Array.from(chatrooms.values()).map(c => c.serialize())
    }

    function getChatHistoryByName(chatroomName) {
        let cur_chatroom = chatrooms.get(chatroomName)
        return cur_chatroom.getChatHistory();
    }

    function getAllChatroomNames() {
        let chatroomNames = Array.from(chatrooms.keys());
        return chatroomNames;
    }

    return {
        createNewChatroom,
        removeClient,
        getChatroomByName,
        serializeChatrooms,
        getAllChatroomNames,
        getChatHistoryByName
    }
}
