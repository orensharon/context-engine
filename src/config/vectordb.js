"use strict"

const providers = {
    qdrant: {
        vectors: {
            size: parseInt(process.env.VECTOR_SIZE),
            distance: 'Cosine'
        }
    }
}

const config = {
    provider: process.env.VECTORDB_PROVIDER,
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    ...providers[process.env.VECTORDB_PROVIDER]
};

module.exports = config;