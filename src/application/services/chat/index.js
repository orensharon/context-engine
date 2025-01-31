"use strict"

const ChatActions = require('./chat.actions')
const { ChatRepository } = require('./../../../domain/repositories')


const init = (deps) => {

    const repository = ChatRepository.init({})
    const chatActions = ChatActions.init({
        subjectService: deps.subjectService,
        contextEngine: deps.contextEngine,
        repository
    })


    return {
        commands: {
            ...chatActions.commands,
        },
        queries: {
            ...chatActions.queries,
        }
    }
}

module.exports = { init }
