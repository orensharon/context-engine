"use strict"

const ChatRoutes = require('./chat.routes')


const init = (path, service) => {
    const routes = []
    const chat = ChatRoutes.init(service)


    routes.push(
        ...chat,
    )

    return {
        path,
        routes
    }
}

module.exports = { init }
