"use strict"

const Services = require('./services')

const init = (deps) => {
    const services = Services.init({
        contextEngine: deps.contextEngine,
    })
    return { services }
}

module.exports = {
    init
}