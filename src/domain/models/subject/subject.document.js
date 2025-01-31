"use strict"

const { Entity } = require('./../../core')
const { ValidationError } = require('./../../../errors')

class Document extends Entity {
    constructor(props = {}) {
        super(props)
        this.title = props.title
        this.content = props.content
        this.subjectId = props.subjectId
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
    }

    static create(props) {
        Document.validate(props)
        return new Document({
            id: props.id,
            title: props.title,
            content: props.content,
            subjectId: props.subjectId,
            createdAt: props.timestamp,
            updatedAt: props.timestamp
        })
    }

    static validate(props) {
        super.validate(props)
        const { title, content, subjectId, timestamp } = props
        const titleError = Document.validateTitle(title)
        if (titleError) throw new ValidationError(titleError, { title })
        const contentError = Document.validateContent(content)
        if (contentError) throw new ValidationError(contentError, { content })
        const subjectIdError = Document.validateSubjectId(subjectId)
        if (subjectIdError) throw new Error(subjectIdError, { subjectId })
        const timestampError = Document.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
    }

    static validateTitle(title) {
        if (title === undefined)
            return 'Title is required'
        if (typeof title !== 'string')
            return `Invalid title ${title}`
        return null
    }

    static validateContent(content) {
        if (content === undefined)
            return 'Content is required'
        if (typeof content !== 'string')
            return `Invalid content ${content}`
        return null
    }

    static validateSubjectId(subjectId) {
        if (subjectId === undefined)
            return 'Subject ID is required'
        if (typeof subjectId !== 'string')
            return `Invalid subject ID ${subjectId}`
        return null
    }

    static validateTimestamp(timestamp) {
        if (timestamp === undefined)
            return 'Timestamp is required'
        if (typeof timestamp !== 'number')
            return `Invalid timestamp ${timestamp}`
        return null
    }

    changeTitle(title, timestamp) {
        const titleError = Document.validateTitle(title)
        if (titleError) throw new ValidationError(titleError, { title })
        const timestampError = Document.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
        this.title = title
        this.updatedAt = timestamp
    }

    changeContent(content, timestamp) {
        const contentError = Document.validateContent(content)
        if (contentError) throw new ValidationError(contentError, { content })
        const timestampError = Document.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
        this.content = content
        this.updatedAt = timestamp
    }

    toDTO() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            subjectId: this.subjectId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}

module.exports = Document 