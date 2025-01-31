"use strict"

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
    server: {
        port: process.env.PORT,
        path: '/api'
    },
    contextEngine: {
        llm: require('./llm'),
        vectordb: require('./vectordb'),
        queries: {
            maxTokens: 300,
            temperature: 0
        },
        answer: {
            maxTokens: 500,
            temperature: 0.5
        }
    }
};


module.exports = config;