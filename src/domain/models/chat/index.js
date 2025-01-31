"use strict"

const { AggregateRoot } = require("../../core")
const Message = require("./chat.message")

class Chat extends AggregateRoot {
    constructor(props) {
        super(props)
        this.subjectId = props.subjectId
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
        this.messages = props.messages.map(m => new Message(m))
    }

    static create(props) {
        Chat.validate(props)
        return new Chat({
            id: props.id,
            subjectId: props.subjectId,
            messages: [],
            createdAt: props.timestamp,
            updatedAt: props.timestamp
        })
    }

    static validate(props) {
        super.validate(props)
        const { subjectId, timestamp } = props
        const subjectIdError = Chat.validateSubjectId(subjectId)
        if (subjectIdError) throw new Error(subjectIdError, { subjectId })
        const timestampError = Chat.validateTimestamp(timestamp)
        if (timestampError) throw new Error(timestampError, { timestamp })
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
            return 'Timestamp must be a Unix timestamp (number)'
        if (timestamp <= 0)
            return 'Timestamp must be a valid Unix timestamp'
        return null
    }

    addUserPrompt(content, timestamp) {
        const message = Message.create({
            content,
            role: 'user',
            chatId: this.id,
            timestamp
        });
        this.messages.push(message);
        this.updatedAt = timestamp;
        return message;
    }

    addAssistantPrompt(content, timestamp) {
        const message = Message.create({
            content,
            role: 'assistant',
            chatId: this.id,
            timestamp
        });
        this.messages.push(message);
        this.updatedAt = timestamp;
        return message;
    }

    toDTO() {
        return {
            id: this.id,
            subjectId: this.subjectId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            messages: this.messages.map(m => m.toDTO())
        }
    }
}

module.exports = Chat 