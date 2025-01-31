"use strict"

const { ChatValidation } = require('../../validation')

const init = (service) => {
    const routes = []
    const sendMessage = MakeSendMessage(service.commands)
    
    routes.push({
        method: 'post',
        path: '/',
        handler: [ChatValidation.sendMessage, sendMessage]
    })

    return routes
}

const MakeSendMessage = (service) => async (req, res, next) => {
    const { body } = req
    const sendMessage = async () => {
        const result = await service.sendMessage(body)
        res.status(200).json(result)
    }
    try { await sendMessage() }
    catch (error) { return next(error) }
}
module.exports = { init }
