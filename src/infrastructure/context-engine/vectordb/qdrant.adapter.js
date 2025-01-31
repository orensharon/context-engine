"use strict"

const { QdrantClient } = require('@qdrant/js-client-rest')

const init = (config) => {
    const client = new QdrantClient({
        url: config.url,
        apiKey: config.apiKey,
        timeout: config.timeout
    })

    const ensureCollection = MakeEnsureCollection(client, config.vectors)
    const deleteCollection = MakeDeleteCollection(client)
    const getCollection = MakeGetCollection(client)
    const listCollections = MakeListCollections(client)
    const createFieldIndex = MakeCreateFieldIndex(client)
    const upsert = MakeUpsert(client)
    const search = MakeSearch(client)
    const deleteByIds = MakeDeleteByIds(client)
    const getVectorsByIds = MakeGetVectorsByIds(client)

    return {
        ensureCollection,
        deleteCollection,
        listCollections,
        createFieldIndex,
        getCollection,
        upsert,
        search,
        deleteByIds,
        getVectorsByIds
    }
}

const MakeEnsureCollection = (client, config) => async (collectionName, options = {}) => {
    try { return await client.getCollection(collectionName) }
    catch (error) { if (error.status !== 404) throw error }
    const result = await client.createCollection(collectionName, {
        vectors: {
            size: config.size || options.size,
            distance: config.distance || options.distance
        }
    })
    if (!result) throw new Error(`Failed to create collection ${collectionName}`)
    console.log(`Collection ${collectionName} created`)
    return result
}

const MakeDeleteCollection = (client) => async (collectionName) => {
    const result = await client.deleteCollection(collectionName)
    if (!result) throw new Error(`Failed to delete collection ${collectionName}`)
    else console.log(`Collection ${collectionName} deleted`)
    return result
}

const MakeGetCollection = (client) => async (collectionName) => {
    try { return await client.getCollection(collectionName) }
    catch (error) { if (error.status !== 404) throw error }
    return null
}

const MakeListCollections = (client) => () => {
    return client.getCollections()
}

const MakeCreateFieldIndex = (client) => (collectionName, options) => {
    return client.createPayloadIndex(collectionName, { ...options, wait: true })
}

const MakeUpsert = (client) => async (collectionName, points) => {
    const normalizedPoints = []
        .concat(points)
        .map(point => ({
            id: point.id,
            vector: point.vector,
            payload: point.metadata
        }))
    const result = await client.upsert(collectionName, {
        wait: true,
        points: normalizedPoints
    })
    if (!result) throw new Error(`Failed to upsert ${points.length} points to collection ${collectionName}`)
    console.log(`${normalizedPoints.length} points upserted to collection ${collectionName}`)
    return result
}

const MakeDeleteByIds = (client) => async (collectionName, ids) => {
    const result = await client.delete(collectionName, { points: ids })
    if (!result) throw new Error(`Failed to delete ${ids.length} points from collection ${collectionName}`)
    console.log(`${ids.length} points deleted from collection ${collectionName}`)
    return result
}

const MakeSearch = (client, config) => (collectionName, vector, options = {}) => {
    // TODO: read limit from config
    return client.search(collectionName, {
        vector,
        limit: options.limit || 3
    })
}

const MakeGetVectorsByIds = (client) => (collectionName, ids) => {
    return client.retrieve(collectionName, ids)
}

module.exports = { init } 