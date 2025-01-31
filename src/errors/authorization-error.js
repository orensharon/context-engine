"use strict"

const BaseError = require("./base-error");

class AuthorizationError extends BaseError {
    constructor(message = 'Authorization failed', description) {
        super(message,description)
    }
}
module.exports = AuthorizationError;
