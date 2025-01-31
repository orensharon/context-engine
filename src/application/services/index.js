"use strict"

const SubjectService = require('./subject')
const ChatService = require('./chat')

const init = (deps) => {

    const subject = SubjectService.init({
        contextEngine: deps.contextEngine,
    })
    const chat = ChatService.init({
        contextEngine: deps.contextEngine,
        subjectService: subject
    })
    
    return {
        subject,
        chat
    }
}

module.exports = {
    init
}