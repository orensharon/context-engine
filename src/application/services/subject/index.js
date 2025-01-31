"use strict"

const SubjectActions = require('./subject.actions')
const DocumentActions = require('./subject.document.actions')
const { SubjectRepository } = require('./../../../domain/repositories')

const init = (deps) => {

    const repository = SubjectRepository.init({})
    const documentActions = DocumentActions.init({
        contextEngine: deps.contextEngine,
        repository
    })
    const subjectActions = SubjectActions.init({
        contextEngine: deps.contextEngine,
        repository,
        documentActions
    })

    return {
        commands: {
            ...subjectActions.commands,
            ...documentActions.commands
        },
        queries: {
            ...subjectActions.queries,
            ...documentActions.queries
        }
    }
}

module.exports = { init }
