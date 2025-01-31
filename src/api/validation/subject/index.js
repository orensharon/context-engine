"use strict"

const SubjectValidation = require('./subject.validation')
const DocumentValidation = require('./subject.document.validation')

module.exports = {
    ...SubjectValidation,
    ...DocumentValidation
}