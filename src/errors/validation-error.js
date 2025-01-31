"use strict"

const BaseError = require("./base-error");

class ValidationError extends BaseError {
    constructor(message = 'Validation failed', description) {
        super(message,description)
    }
}
module.exports = ValidationError;
