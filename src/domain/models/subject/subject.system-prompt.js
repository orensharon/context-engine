"use strict"

const { Entity } = require('./../../core')
const { ValidationError } = require('./../../../errors')

class SystemPrompt extends Entity {
    constructor(props) {
        super(props)
        this.content = props.content;
        this.subjectId = props.subjectId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props) {
        SystemPrompt.validate(props)
        return new SystemPrompt({
            id: props.id,
            content: props.content,
            subjectId: props.subjectId,
            createdAt: props.timestamp,
            updatedAt: props.timestamp
        })
    }

    static validate(props) {
        super.validate(props)
        const { content, subjectId, timestamp } = props
        const contentError = SystemPrompt.validateContent(content)
        if (contentError) throw new ValidationError(contentError, { content })
        const subjectIdError = SystemPrompt.validateSubjectId(subjectId)
        if (subjectIdError) throw new Error(subjectIdError, { subjectId })
        const timestampError = SystemPrompt.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
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

    changeContent(content, timestamp) {
        const contentError = SystemPrompt.validateContent(content)
        if (contentError) throw new ValidationError(contentError)
        const timestampError = SystemPrompt.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
        this.content = content
        this.updatedAt = timestamp
    }

    toDTO() {
        return {
            id: this.id,
            content: this.content,
            subjectId: this.subjectId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}

module.exports = SystemPrompt 