const { body } = require('express-validator');
const { validateRequest } = require('./../../middlewares')

const commonRules = {
    subjectId: body('subjectId')
        .trim()
        .notEmpty()
        .withMessage('Subject ID is required')
        .isString()
        .withMessage('Subject ID must be a string'),

    message: body('message')
        .isObject()
        .withMessage('Message must be an object'),

    'message.content': body('message.content')
        .trim()
        .notEmpty()
        .withMessage('Message content is required')
        .isString()
        .withMessage('Message content must be a string'),

    chatId: body('chatId')
        .trim()
        .optional()
        .isString()
        .withMessage('Chat ID must be a string'),
};


const sendMessage = [
    commonRules.subjectId,
    commonRules.message,
    commonRules.chatId,
    validateRequest
];



module.exports = {
    sendMessage
}; 