"use strict"

const Errors = require("../../errors")
const { ErrorHandler } = require("../../utils")

const errorHandler = (error, _, res, next) => {
    const code = getCode(error)
    const message = getMessage(error)
    res.status(code).send(message)
    ErrorHandler.log(error)
    next()
}
 
const getCode = (error) => {
    if (error instanceof Errors.ValidationError) return 400
    if (error instanceof Errors.ResourceNotFoundError) return 404
    if (error instanceof Errors.DuplicationError) return 409
    if (error instanceof Errors.AuthorizationError) return 403
    return 500
}

const getMessage = (error) => {
    if (!error.operational)
        return { message: 'Internal error' }
    const { message, description } = error
    if (!error.description)
        return { message: error.message }
    if (error.description instanceof Array)
        return { message, errors: description }
    return { message, errors: description }
}

module.exports = { errorHandler }
