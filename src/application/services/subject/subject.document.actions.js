"use strict"

const { GenerateId } = require('../../../utils')
const { ResourceNotFoundError } = require('../../../errors')

const init = (deps) => {
    const addDocumentToSubject = MakeAddDocumentToSubject(deps)
    const addDocuments = MakeAddDocuments({ ...deps, addDocumentToSubject })
    const removeDocument = MakeRemoveDocument(deps)
    const getDocumentById = MakeGetDocumentById(deps)
    const listDocuments = MakeListDocuments(deps)
    const changeDocumentTitle = MakeChangeDocumentTitle(deps)
    const changeDocumentContent = MakeChangeDocumentContent(deps)

    return {
        commands: {
            addDocuments,
            removeDocument,
            changeDocumentTitle,
            changeDocumentContent
        },
        queries: {
            getDocumentById,
            listDocuments
        }
    }
}

const MakeAddDocumentToSubject = (deps) => async (subject, props) => {
    const { contextEngine } = deps
    const documentId = GenerateId()
    const timestamp = Date.now()
    const document = subject.addDocument({
        id: documentId,
        title: props.title,
        content: props.content,
        timestamp
    })
    const data = {
        id: document.id,
        content: document.content,
        metadata: {}
    }
    try { await contextEngine.embed(subject.id, data) }
    catch (error) {
        subject.removeDocument(document.id, timestamp)
        throw error
    }
    console.log(`Document with id ${document.id} added to subject ${subject.id}`)
    return document
}

const MakeAddDocuments = (deps) => async (subjectId, documents) => {
    const { repository, addDocumentToSubject } = deps
    const subject = await repository.findById(subjectId)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { subjectId })
    const addedDocuments = []
    for (const props of documents)
        try { addedDocuments.push(await addDocumentToSubject(subject, props)) }
        catch (error) { console.error(error) }
    await repository.store(subject)
    return addedDocuments
}

const MakeRemoveDocument = (deps) => async (subjectId, id) => {
    const { repository, contextEngine } = deps
    const subject = await repository.findById(subjectId)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { subjectId })
    const timestamp = Date.now()
    subject.removeDocument(id, timestamp)
    await contextEngine.deleteDocument(subject.id, id)
    await repository.store(subject)
    console.log(`Document with id ${id} removed from subject ${subject.id}`)
    return { id }
}

const MakeGetDocumentById = (deps) => async (subjectId, id) => {
    const { repository } = deps
    const subject = await repository.findById(subjectId)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { subjectId })
    const document = subject.documents.find(doc => doc.id === id)
    if (!document) throw new ResourceNotFoundError("Document not found", { id })
    return document
}

const MakeListDocuments = (deps) => async (subjectId) => {
    const { repository } = deps
    const subject = await repository.findById(subjectId)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { subjectId })
    return subject.documents
}

const MakeChangeDocumentTitle = (deps) => async (subjectId, id, title) => {
    const { repository } = deps
    const subject = await repository.findById(subjectId)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { subjectId })
    const timestamp = Date.now()
    subject.changeDocumentTitle(id, title, timestamp)
    // TODO: update embedding
    await repository.store(subject)
    const document = subject.getDocumentById(id)
    console.log(`Document with id ${document.id} title changed to ${title} in subject ${subject.id}`)
    return document
}

const MakeChangeDocumentContent = (deps) => async (subjectId, id, content) => {
    const { repository } = deps
    const subject = await repository.findById(subjectId)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { subjectId })
    const timestamp = Date.now()
    subject.changeDocumentContent(id, content, timestamp)
    // TODO: update embedding
    await repository.store(subject)
    const document = subject.getDocumentById(id)
    console.log(`Document with id ${document.id} content changed to ${content} in subject ${subject.id}`)
    return document
}

module.exports = { init }
