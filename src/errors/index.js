"use strict"

const ResourceNotFoundError = require('./resource-not-found')
const ValidationError = require('./validation-error')
const DuplicationError = require('./duplication')
const AuthorizationError = require('./authorization-error')

module.exports = {
    ResourceNotFoundError,
    ValidationError,
    DuplicationError,
    AuthorizationError
}