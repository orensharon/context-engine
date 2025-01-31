"use strict"

const SubjectRoutes = require('./subject')
const ChatRoutes = require('./chat')

const init = (services) => {
    const subject = SubjectRoutes.init('subjects', services.subject)
    const chat = ChatRoutes.init('chats', services.chat)
    return [subject, chat]
}

module.exports = { init }