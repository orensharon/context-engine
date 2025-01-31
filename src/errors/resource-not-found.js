"use strict"

const BaseError = require("./base-error");

class ResourceNotFoundError extends BaseError {
    constructor(message = 'Resource not found', description) {
        super(message, description)
    }
}
module.exports = ResourceNotFoundError;
