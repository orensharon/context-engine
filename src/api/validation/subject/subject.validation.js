const { body, param } = require('express-validator');
const { validateRequest } = require('./../../middlewares')

const commonRules = {
    id: param('id')
        .trim()
        .notEmpty()
        .withMessage('ID is required')
        .isString()
        .withMessage('ID must be a string'),
        
    name: body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
        
    documents: body('documents')
        .optional()
        .isArray()
        .withMessage('Documents must be an array'),
        
    documentTitle: body('documents.*.title')
        .if(body('documents').exists())
        .notEmpty()
        .withMessage('Document title is required')
        .isString()
        .withMessage('Document title must be a string'),
        
    documentContent: body('documents.*.content')
        .if(body('documents').exists())
        .notEmpty()
        .withMessage('Document content is required')
        .isString()
        .withMessage('Document content must be a string')
};

const create = [
    commonRules.name,
    commonRules.documents,
    commonRules.documentTitle,
    commonRules.documentContent,
    validateRequest
];

const remove = [
    commonRules.id,
    validateRequest
];

const changeName = [
    commonRules.id,
    commonRules.name,
    validateRequest
];

const getById = [
    commonRules.id,
    validateRequest
];

module.exports = {
    create,
    remove,
    changeName,
    getById
}; 