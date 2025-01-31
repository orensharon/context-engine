"use strict"

const BaseError = require("./base-error");

class DuplicationError extends BaseError {
    constructor(message = 'Duplicate resource', description) {
        super(message, description)
    }
}
module.exports = DuplicationError;
