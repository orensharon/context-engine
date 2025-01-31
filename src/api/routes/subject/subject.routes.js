"use strict"

const { SubjectValidation } = require('../../validation')

const init = (service) => {
    const routes = []
    const create = MakeCreate(service.commands)
    const remove = MakeRemove(service.commands)
    const changeName = MakeChangeName(service.commands)
    const getById = MakeGetById(service.queries)
    const list = MakeList(service.queries)

    routes.push({
        method: 'post',
        path: '/',
        handler: [SubjectValidation.create, create]
    })
    routes.push({
        method: 'delete',
        path: '/:id',
        handler: [SubjectValidation.remove, remove]
    })
    routes.push({
        method: 'get',
        path: '/',
        handler: list
    })
    routes.push({
        method: 'get',
        path: '/:id',
        handler: [SubjectValidation.getById, getById]
    })
    routes.push({
        method: 'put',
        path: '/:id/name',
        handler: [SubjectValidation.changeName, changeName]
    })

    return routes
}

const MakeCreate = (service) => async (req, res, next) => {
    const { body } = req
    const create = async () => {
        const result = await service.create(body)
        res.status(200).json(result.toDTO())
    }
    try { await create() }
    catch (error) { return next(error) }
}

const MakeRemove = (service) => async (req, res, next) => {
    const { id } = req.params
    const remove = async () => {
        const result = await service.remove(id)
        res.status(200).json(result)
    }
    try { await remove() }
    catch (error) { return next(error) }
}

const MakeChangeName = (service) => async (req, res, next) => {
    const { id } = req.params
    const { body } = req
    const changeName = async () => {
        const result = await service.changeName(id, body.name)
        res.status(200).json(result.toDTO())
    }
    try { await changeName() }
    catch (error) { return next(error) }
}

const MakeGetById = (service) => async (req, res, next) => {
    const { id } = req.params
    const getById = async () => {
        const result = await service.getById(id)
        res.status(200).json(result.toDTO())
    }
    try { await getById() }
    catch (error) { return next(error) }
}

const MakeList = (service) => async (req, res, next) => {
    const list = async () => {
        const result = await service.list()
        res.status(200).json(result.map(subject => subject.toDTO()))
    }
    try { await list() }
    catch (error) { return next(error) }
}

module.exports = { init }
