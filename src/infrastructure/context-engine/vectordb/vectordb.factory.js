const QdrantAdapter = require('./qdrant.adapter')

const PROVIDERS = {
    QDRANT: 'qdrant'
}

const create = ({ provider, ...config }) => {
    switch (provider.toLowerCase()) {
        case PROVIDERS.QDRANT:
            return QdrantAdapter.init(config)
        default:
            throw new Error(`Unsupported vector database provider: ${provider}`)
    }
}

module.exports = {
    create
}