const Routes = require('./routes')
const { errorHandler } = require('./middlewares')

const init = (services) => {
    const routes = Routes.init(services)
    return { routes, errorHandler }
}

module.exports = {
    init
}