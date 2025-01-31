"use strict"

const llms = {
    openai: {

    },
    llama: {

    }
};


const config = {
    provider: process.env.LLM_PROVIDER,
    baseUrl: process.env.LLM_API_BASE_URL,
    apiKey: process.env.LLM_API_KEY,
    chat: {
        model: process.env.LLM_CHAT_MODEL
    },
    embedding: {
        model: process.env.LLM_EMBEDDING_MODEL
    },
    ...llms[process.env.LLM_PROVIDER]
};


module.exports = config;