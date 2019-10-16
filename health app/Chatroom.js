
module.exports = function ({ name, messages }) {
    const members = new Map();
    let chatHistory = [...messages]
    console.log('Chat history loaded!', chatHistory)

    function broadcastMessage(message) {
        members.forEach(m => m.emit('message', message))
    }

    function addEntry(entry) {
        chatHistory = chatHistory.concat(entry)
    }

    function getChatHistory() {
        return chatHistory.slice()
    }

    function addUser(client) {
        console.log("ADDED " + client.id + " TO THE ROOM " + name)
        members.set(client.id, client)
    }

    function removeUser(client) {
        members.delete(client.id)
    }

    function serialize() {
        return {
            name,
            numMembers: members.size
        }
    }

    return {
        broadcastMessage,
        addEntry,
        getChatHistory,
        addUser,
        removeUser,
        serialize
    }
}