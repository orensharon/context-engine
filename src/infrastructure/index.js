"use strict"

const WebServer = require('./webserver')
const ContextEngine = require('./context-engine/index')

const init = (config) => {
    const webserver = WebServer.init(config.webserver)
    const contextEngine = ContextEngine.init(config.contextEngine)

    return {
        webserver,
        contextEngine
    }
}
module.exports = {
    init
}