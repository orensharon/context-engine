"use strict"

const { body, param } = require('express-validator');
const { validateRequest } = require('./../../middlewares')

const commonRules = {
    subjectId: param('id')
        .trim()
        .notEmpty()
        .withMessage('Subject ID is required')
        .isString()
        .withMessage('Subject ID must be a string'),

    documentId: param('documentId')
        .trim()
        .notEmpty()
        .withMessage('Document ID is required')
        .isString()
        .withMessage('Document ID must be a string'),

    documents: body()
        .isArray()
        .withMessage('Documents must be an array')
        .notEmpty()
        .withMessage('Documents array cannot be empty'),

    documentArrayTitle: body('*.title')
        .trim()
        .notEmpty()
        .withMessage('Document title is required')
        .isString()
        .withMessage('Document title must be a string'),

    documentArrayContent: body('*.content')
        .trim()
        .notEmpty()
        .withMessage('Document content is required')
        .isString()
        .withMessage('Document content must be a string'),

    singleDocumentTitle: body('title')
        .trim()
        .notEmpty()
        .withMessage('Document title is required')
        .isString()
        .withMessage('Document title must be a string'),

    singleDocumentContent: body('content')
        .trim()
        .notEmpty()
        .withMessage('Document content is required')
        .isString()
        .withMessage('Document content must be a string')
};

const addDocuments = [
    commonRules.subjectId,
    commonRules.documents,
    commonRules.documentArrayTitle,
    commonRules.documentArrayContent,
    validateRequest
];

const removeDocument = [
    commonRules.subjectId,
    commonRules.documentId,
    validateRequest
];

const getDocumentById = [
    commonRules.subjectId,
    commonRules.documentId,
    validateRequest
];

const listDocuments = [
    commonRules.subjectId,
    validateRequest
];

const changeDocumentTitle = [
    commonRules.subjectId,
    commonRules.documentId,
    commonRules.singleDocumentTitle,
    validateRequest
];

const changeDocumentContent = [
    commonRules.subjectId,
    commonRules.documentId,
    commonRules.singleDocumentContent,
    validateRequest
];

module.exports = {
    addDocuments,
    removeDocument,
    getDocumentById,
    listDocuments,
    changeDocumentTitle,
    changeDocumentContent
}; 