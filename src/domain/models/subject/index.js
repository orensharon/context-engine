"use strict"

const { AggregateRoot } = require('../../core')
const { ValidationError, ResourceNotFoundError, DuplicationError } = require('../../../errors')
const Document = require('./subject.document')

class Subject extends AggregateRoot {
    constructor(props = {}) {
        super(props)
        this.name = props.name
        this.documents = props.documents.map(doc => new Document(doc))
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
    }

    static create(props) {
        Subject.validate(props)
        return new Subject({
            id: props.id,
            name: props.name,
            createdAt: props.timestamp,
            documents: []
        })
    }

    static validate(props) {
        super.validate(props)
        const { name, timestamp } = props
        const nameError = Subject.validateName(name)
        if (nameError) throw new ValidationError(nameError, { name })
        const timestampError = Subject.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
    }

    static validateName(name) {
        if (name === undefined)
            return 'Name is required'
        if (typeof name !== 'string')
            return `Invalid name ${name}`
        return null
    }

    static validateTimestamp(timestamp) {
        if (timestamp === undefined)
            return 'Timestamp is required'
        if (typeof timestamp !== 'number')
            return 'Timestamp must be a Unix timestamp (number)'
        if (timestamp <= 0)
            return 'Timestamp must be a valid Unix timestamp'
        return null
    }

    changeName(name, timestamp) {
        const nameError = Subject.validateName(name)
        if (nameError) throw new ValidationError(nameError, { name })
        const timestampError = Subject.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
        this.name = name
        this.updatedAt = timestamp
    }

    addDocument(props) {
        const document = Document.create({
            id: props.id,
            title: props.title,
            content: props.content,
            subjectId: this.id,
            timestamp: props.timestamp
        })
        if (this.getDocumentById(document.id))
            throw new DuplicationError('Document already exists in this subject', { document })
        this.documents.push(document)
        this.updatedAt = document.updatedAt
        return document
    }

    removeDocument(id, timestamp) {
        const index = this.documents.findIndex(doc => doc.id === id)
        if (index === -1) throw new ResourceNotFoundError('Document not found in this subject', { id })
        const timestampError = Subject.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
        this.documents.splice(index, 1)
        this.updatedAt = timestamp
    }

    changeDocumentTitle(id, title, timestamp) {
        const document = this.getDocumentById(id)
        if (!document) throw new ResourceNotFoundError('Document not found in this subject', { id })
        const titleError = Document.validateTitle(title)
        if (titleError) throw new ValidationError(titleError, { title })
        const timestampError = Subject.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
        document.changeTitle(title, timestamp)
        this.updatedAt = timestamp
    }

    changeDocumentContent(id, content, timestamp) {
        const document = this.getDocumentById(id)
        if (!document) throw new ResourceNotFoundError('Document not found in this subject', { id })
        const contentError = Document.validateContent(content)
        if (contentError) throw new ValidationError(contentError, { content })
        const timestampError = Subject.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
        document.changeContent(content, timestamp)
        this.updatedAt = timestamp
    }

    getDocumentById(id) {
        return this.documents.find(doc => doc.id === id) || null
    }

    toDTO() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            documents: this.documents.map(doc => doc.toDTO())
        }
    }
}

module.exports = Subject;
