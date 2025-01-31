"use strict"

const LLM = require('./llm/llm.factory')
const Vectordb = require('./vectordb/vectordb.factory')

const init = (config) => {
    const vectordb = Vectordb.create(config.vectordb)
    const llm = LLM.create(config.llm)

    const embed = MakeEmbed({ vectordb, llm })
    const generateSearchQueries = MakeGenerateSearchQueries({ llm }, config.queries)
    const findRelevantContexts = MakeFindRelevantContexts({ llm, vectordb })
    const generateAnswer = MakeGenerateAnswer({ generateSearchQueries, findRelevantContexts, llm }, config.answer)
    const query = MakeQuery({ generateSearchQueries, findRelevantContexts, generateAnswer })
    return { embed, query }
}

const MakeEmbed = (deps) => async (collection, document) => {
    const { llm, vectordb } = deps
    if (!document.id) throw new Error("Document id is required")
    if (!document.content) throw new Error("Document content is required")
    const { id, content } = document
    await vectordb.ensureCollection(collection)
    const vector = await llm.createEmbedding(content)
    console.log(`Vector for ${id} created`)
    return await vectordb.upsert(collection, {
        id,
        metadata: { content },
        vector
    })
}

const MakeQuery = (deps) => async (collection, query) => {
    const { generateSearchQueries, findRelevantContexts, generateAnswer } = deps
    const { systemPrompts, userPrompt } = query
    const queries = await generateSearchQueries(systemPrompts.queries, userPrompt)
    const contexts = await findRelevantContexts(collection, queries)
    const answer = await generateAnswer(systemPrompts.answer, userPrompt, contexts)
    return { queries, contexts, answer }
}

const MakeGenerateSearchQueries = (deps, config) => async (systemPrompts, userPrompt) => {
    const { llm } = deps
    const messages = [
        ...systemPrompts.map(prompt => ({ role: 'system', content: prompt })),
        { role: 'user', content: userPrompt }
    ]
    const response = await llm.chat(messages, {
        maxTokens: config.maxTokens,
        temperature: config.temperature
    })
    return response.trim()
        .split(/\r?\n+/)
        .map(line => line.trim())
        .filter(Boolean);

}

const MakeFindRelevantContexts = (deps) => async (collection, queries) => {
    const { llm, vectordb } = deps
    const contexts = await Promise.all(
        queries.map(async query => {
            const vector = await llm.createEmbedding(query)
            const results = await vectordb.search(collection, vector, { limit: 3 })
            return results[0]
        })
    )
    const uniqueContexts = [...new Map(contexts.map(ctx => [ctx.id, ctx])).values()];
    return uniqueContexts.sort((a, b) => b.score - a.score)[0].payload;
}

const MakeGenerateAnswer = (deps, config) => async (systemPrompts, userPrompt, context) => {
    const { llm } = deps
    const messages = [
        ...systemPrompts.map(prompt => ({ role: 'system', content: prompt })),
        { role: 'system', content: `Retrieved context: ${context.content}` },
        { role: 'user', content: `User's question: ${userPrompt}` }
    ]
    const response = await llm.chat(messages, {
        maxTokens: config.maxTokens,
        temperature: config.temperature
    })
    return response.trim()
}

module.exports = { init }