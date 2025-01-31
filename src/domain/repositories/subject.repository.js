"use strict"

const { Subject } = require("../models")

const init = (deps) => {
    deps.subjects = new Map()

    const store = MakeStore(deps)
    const remove = MakeRemove(deps)
    const list = MakeList(deps)
    const findById = MakeFindById(deps)

    return { store, remove, list, findById }
}

const MakeStore = ({ subjects }) => async (subject) => {
    const model = new Subject(subject)
    subjects.set(subject.id, model)
    return new Subject(model)
}

const MakeRemove = ({ subjects }) => async (subject) => {
    if (!subjects.has(subject.id))
        return null
    subjects.delete(subject.id)
    return subject.id
}

const MakeList = ({ subjects }) => async () => {
    return Array.from(subjects.values()).map(m => new Subject(m))
}

const MakeFindById = ({ subjects }) => async (id) => {
    const subject = subjects.get(id)
    if (!subject)
        return null
    return new Subject(subject)
}

module.exports = { init } 