"use strict"

const { Chat } = require("../models")

const init = (deps) => {
    deps.chats = []

    const store = MakeStore(deps)
    const remove = MakeRemove(deps)
    const list = MakeList(deps)
    const findById = MakeFindById(deps)

    return { store, remove, list, findById }
}

const MakeStore = ({ chats }) => async (chat) => {
    const model = new Chat(chat)
    chats.push(model)
    return new Chat(model)
}


const MakeRemove = ({ chats }) => async (chat) => {
    const index = chats.findIndex(c => c.id === chat.id);
    if (index === -1) return null;
    chats.splice(index, 1);
    return chat.id
}

const MakeList = ({ chats }) => async () => {
    return chats.map(m => new Chat(m))
}


const MakeFindById = ({ chats }) => async (id) => {
    const chat = chats.find(c => c.id === id)
    if (!chat) return null
    return new Chat(chat)
}



module.exports = { init } 