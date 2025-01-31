"use strict"

const { SubjectValidation } = require('../../validation')

const init = (path, service) => {
    const routes = []

    const addDocuments = MakeAddDocuments(service.commands)
    const removeDocument = MakeRemoveDocument(service.commands)
    const getDocumentById = MakeGetDocumentById(service.queries)
    const listDocuments = MakeListDocuments(service.queries)
    const changeDocumentTitle = MakeChangeDocumentTitle(service.commands)
    const changeDocumentContent = MakeChangeDocumentContent(service.commands)

    routes.push({
        method: 'post',
        path: `/:id/${path}`,
        handler: [SubjectValidation.addDocuments, addDocuments]
    })
    routes.push({
        method: 'delete',
        path: `/:id/${path}/:documentId`,
        handler: [SubjectValidation.removeDocument, removeDocument]
    })
    routes.push({
        method: 'get',
        path: `/:id/${path}/:documentId`,
        handler: [SubjectValidation.getDocumentById, getDocumentById]
    })
    routes.push({
        method: 'get',
        path: `/:id/${path}`,
        handler: [SubjectValidation.listDocuments, listDocuments]
    })
    routes.push({
        method: 'put',
        path: `/:id/${path}/:documentId/title`,
        handler: [SubjectValidation.changeDocumentTitle, changeDocumentTitle]
    })
    routes.push({
        method: 'put',
        path: `/:id/${path}/:documentId/content`,
        handler: [SubjectValidation.changeDocumentContent, changeDocumentContent]
    })

    return routes
}

const MakeAddDocuments = (service) => async (req, res, next) => {
    const { id } = req.params
    const { body } = req
    const addDocuments = async () => {
        const result = await service.addDocuments(id, body)
        res.status(200).json(result.map(doc => doc.toDTO()))
    }
    try { await addDocuments() }
    catch (error) { return next(error) }
}

const MakeRemoveDocument = (service) => async (req, res, next) => {
    const { id, documentId } = req.params
    const removeDocument = async () => {
        const result = await service.removeDocument(id, documentId)
        res.status(200).json(result)
    }
    try { await removeDocument() }
    catch (error) { return next(error) }
}

const MakeGetDocumentById = (service) => async (req, res, next) => {
    const { id, documentId } = req.params
    const getDocumentById = async () => {
        const result = await service.getDocumentById(id, documentId)
        res.status(200).json(result.toDTO())
    }
    try { await getDocumentById() }
    catch (error) { return next(error) }
}

const MakeListDocuments = (service) => async (req, res, next) => {
    const { id } = req.params
    const listDocuments = async () => {
        const result = await service.listDocuments(id)
        res.status(200).json(result.map(doc => doc.toDTO()))
    }
    try { await listDocuments() }
    catch (error) { return next(error) }
}

const MakeChangeDocumentTitle = (service) => async (req, res, next) => {
    const { id, documentId } = req.params
    const { body } = req
    const changeDocumentTitle = async () => {
        const result = await service.changeDocumentTitle(id, documentId, body.title)
        res.status(200).json(result.toDTO())
    }
    try { await changeDocumentTitle() }
    catch (error) { return next(error) }
}

const MakeChangeDocumentContent = (service) => async (req, res, next) => {
    const { id, documentId } = req.params
    const { body } = req
    const changeDocumentContent = async () => {
        const result = await service.changeDocumentContent(id, documentId, body.content)
        res.status(200).json(result.toDTO())
    }
    try { await changeDocumentContent() }
    catch (error) { return next(error) }
}

module.exports = { init }
