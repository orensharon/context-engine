"use strict"

const { validationResult } = require('express-validator');
const { ValidationError } = require('./../../errors');

const validateRequest = (req, res, next) => {
    const validation = validationResult(req);
    if (validation.isEmpty()) return next();
    const errors = validation.mapped();
    const error = new ValidationError('Validation failed', errors);
    next(error);
};

module.exports = { validateRequest }