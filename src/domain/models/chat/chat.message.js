"use strict"

const { ValueObject } = require('../../core')
const { ValidationError } = require('../../../errors')

class Message extends ValueObject {
    constructor(props) {
        super(props)
        this.role = props.role
        this.content = props.content
        this.timestamp = props.timestamp
    }

    static create(props) {
        Message.validate(props)
        return new Message({
            id: props.id,
            role: props.role,
            content: props.content,
            timestamp: props.timestamp
        })
    }

    static validate(props) {
        super.validate(props)
        const { role, content, timestamp } = props
        const roleError = Message.validateRole(role)
        if (roleError) throw new Error(roleError, { role })
        const contentError = Message.validateContent(content)
        if (contentError) throw new ValidationError(contentError, { content })
        const timestampError = Message.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
    }

    static validateRole(role) {
        if (!role || !['user', 'assistant'].includes(role))
            return 'Message must have a valid role (user or assistant)'
        return null
    }

    static validateContent(content) {
        if (content === undefined)
            return 'Content is required'
        if (typeof content !== 'string')
            return `Invalid content ${content}`
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

    toDTO() {
        return {
            role: this.role,
            content: this.content,
            timestamp: this.timestamp
        }
    }
}

module.exports = Message