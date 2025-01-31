"use strict"

const Entity = require('./entity')

class AggregateRoot extends Entity {
    constructor(props) {
        super(props)
        this.events = []
    }

    static validate(props = {}) {
        super.validate(props)
    }

    enqueue(event) {
        this.events.push(event)
    }

    dequeue() {
        return this.events.splice(0);
    }

    get isDirty() {
        return this.events.length > 0
    }
}
module.exports = AggregateRoot;