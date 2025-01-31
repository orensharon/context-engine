"use strict"

const { GenerateId } = require('../../../utils')
const { ResourceNotFoundError } = require('../../../errors')
const { Subject } = require('../../../domain/models')

const init = (deps) => {

    const create = MakeCreate(deps)
    const remove = MakeRemove(deps)
    const changeName = MakeChangeName(deps)
    const list = MakeList(deps)
    const getById = MakeGetById(deps)

    return {
        commands: {
            create,
            remove,
            changeName
        },
        queries: {
            list,
            getById
        }
    }
}

const MakeCreate = (deps) => async (props) => {
    const { repository, documentActions } = deps
    const id = GenerateId()
    const timestamp = Date.now()
    const subject = Subject.create({
        id,
        name: props.name,
        timestamp
    })
    await repository.store(subject)
    console.log(`Subject with id ${subject.id} created`)
    if (props.documents.length === 0) return subject.toDTO()
    await documentActions.commands.addDocuments(subject.id, props.documents)
    return repository.findById(subject.id)
}

const MakeRemove = (deps) => async (id) => {
    const { repository, contextEngine } = deps
    const subject = await repository.findById(id)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { id })
    await contextEngine.deleteCollection(subject.id)
    await repository.remove(subject)
    console.log(`Subject with id ${subject.id} removed`)
    return { id }
}

const MakeChangeName = (deps) => async (id, name) => {
    const { repository } = deps
    const subject = await repository.findById(id)
    if (!subject) throw new ResourceNotFoundError("Subject not found", { id })
    const timestamp = Date.now()
    subject.changeName(name, timestamp)
    // TODO: update embedding
    await repository.store(subject)
    console.log(`Subject with id ${subject.id} name changed to ${name}`)
    return subject

}

const MakeList = (deps) => () => {
    const { repository } = deps
    return repository.list()
}

const MakeGetById = (deps) => async (id) => {
    const { repository } = deps
    const subject = await repository.findById(id)
    if (!subject)
        throw new ResourceNotFoundError("Subject not found", { id })
    return subject
}

module.exports = { init }
