
const config = require('./config')
const API = require('./api')
const Application = require('./application')
const Infrastructure = require('./infrastructure');

(async () => {
    const infrastructure = Infrastructure.init({
        webserver: config.server,
        contextEngine: config.contextEngine
    })
    const { webserver, contextEngine } = infrastructure
    const application = Application.init({ contextEngine })
    const api = API.init(application.services)
    webserver.setRoutes(api)
    await webserver.start()
})();