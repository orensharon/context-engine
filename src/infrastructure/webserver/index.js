"use strict"

const Express = require('express')
const Middlewares = require('./middlewares')

const init = (config) => {
    const internals = {
        server: null
    }
    const express = Express()

    const setRoutes = MakeSetRoutes(express, config.path)
    const startServer = MakeStartServer(express, config)
    const start = MakeStart(startServer, internals)
    const shutdown = MakeShutdown(internals)
    const getPort = () => internals.server.address().port
    const getServer = () => internals.server

    return {
        getPort,
        getServer,
        setRoutes,
        start,
        shutdown
    }
}

const MakeSetRoutes = (express, basePath) => (api) => {
    Middlewares.forEach(m => express.use(m))
    const root = Express.Router()
    api.routes.forEach(({ path, routes }) => {
        const router = Express.Router()
        routes.forEach(route => {
            router[route.method](route.path, route.handler)
            console.log('Route created: %s/%s%s', basePath, path, route.path)
        })
        root.use(`/${path}`, router)
    });
    express.use(basePath, root)
    if (!Array.isArray(api.errorHandler)) express.use(api.errorHandler)
    else api.errorHandler.forEach(h => express.use(h))
}

const MakeStart = (startServer, internals) => async () => {
    if (internals.server) throw new Error('Web server is already started')
    console.log('Starting server...')
    const server = await startServer()
    Object.assign(internals, { server })
    const { address, port } = server.address()
    console.log('Server started: http://%s:%s', address, port)
}

const MakeStartServer = (express, config) => async () => {
    const { ip, port } = config
    return new Promise((resolve, reject) => {
        const server = express.listen(port, ip, err => {
            if (err) return reject(err)
            resolve(server);
        })
    })
}

const MakeShutdown = (internals) => async () => {
    if (!internals.server) return
    console.log('Closing server...')
    const { server } = internals
    server.closeAllConnections()
    await new Promise((res, rej) => {
        server.close(err => {
            if (err) return rej(err)
            res()
        })
    })
    internals.server = null
    console.log('Server closed')
}

module.exports = {
    init
}