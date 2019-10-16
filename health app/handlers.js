function makeHandleEvent(client, clientManager, chatroomManager) {
    function ensureExists(getter, rejectionMessage) {
        return new Promise(function(resolve, reject) {
            const res = getter()
            return res
            ? resolve(res)
            : reject(rejectionMessage)
        })
    }

    function ensureUserSelected(clientId) {
        return ensureExists(
            () => clientManager.getUserByClientId(clientId),
            'select user first'
        )
    }

    function ensureValidChatroom(chatroomName) {
        return ensureExists(
            () => chatroomManager.getChatroomByName(chatroomName),
            `invalid chatroom name: ${chatroomName}`
        )
    }

    function ensureValidChatroomAndUserSelected(chatroomName) {
        return Promise.all([
            ensureValidChatroom(chatroomName),
            ensureUserSelected(client.id)
        ])
        .then(([chatroom, user]) => Promise.resolve({ chatroom, user }))
    }

    function handleEvent(chatroomName, createEntry) {
        return ensureValidChatroomAndUserSelected(chatroomName)
        .then(function ({ chatroom, user }) {
            if (createEntry != null) {
                const entry = {user, ...createEntry()}
                chatroom.addEntry(entry)

                chatroom.broadcastMessage({ chat: chatroomName, ...entry})
            }
            return chatroom
        })
    }

    return handleEvent
}

module.exports = function (client, clientManager, chatroomManager) {
    const handleEvent = makeHandleEvent(client, clientManager, chatroomManager)

    function handleRegister(userName, callback) {
        if (!clientManager.isUserAvailable(userName)) {
            return callback('user is not available')
        }

        const user = clientManager.getUserByName(userName)
        clientManager.registerClient(client, user)

        return callback(null, user)
    }

    function handleJoin(chatroomName, callback) {

        handleEvent(chatroomName, null)
            .then(function (chatroom) {
                chatroom.addUser(client)

                callback(null, chatroom.getChatHistory())
            }).catch(callback)
    }

    function handleLeave(chatroomName, callback) {

        handleEvent(chatroomName, null)
            .then(function (chatroom) {
                chatroom.removeUser(client.id)
                handleDisconnect()
                callback(null)
            }).catch(callback);
    }

    function handleMessage({ chatroomName, message } = {}, callback) {
        const createEntry = () => ({ message })

        handleEvent(chatroomName, createEntry)
            .then(() => callback(null))
            .catch(callback)
    }

    function handleGetChatrooms(_, callback) {
        return callback(null, clientManager.getAvailableUsers())
    }

    function handleGetAvailableUsers(_, callback) {
        return callback(null, clientManager.getAvailableUsers())
    }

    function handleNewChatroom(chatroomName, userFullName, firstMessage, callback) {
        chatroomManager.createNewChatroom(chatroomName, userFullName, firstMessage)
        return callback(null, chatroomName);
    }

    function handleSaveToFirebase(firebase, chatroomName) {
        const database = firebase.firestore();
        const new_messages = chatroomManager.getChatHistoryByName(chatroomName);
        database.collection("chatrooms").doc(chatroomName).set({
            messages: new_messages
        }, {merge: true})
        .then(function() {
            console.log("Document succesfully written!")
        })
        .catch((error) => {
            console.error("Error writing document ", error)
        })
        console.log("Writting new chat history to: ", chatroomName)
    }

    function handleDisconnect() {
        clientManager.removeClient(client)
        chatroomManager.removeClient(client)
    }

    return {
        handleRegister,
        handleJoin,
        handleLeave,
        handleMessage,
        handleGetChatrooms,
        handleGetAvailableUsers,
        handleDisconnect,
        handleNewChatroom,
        handleSaveToFirebase
    }

}