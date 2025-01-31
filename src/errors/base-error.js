"use strict"

class BaseError extends Error {
    constructor(message, description, operational = true) {
        super(message)
        this.name = this.constructor.name
        this.description = description
        this.operational = operational
    }
}

module.exports = BaseError