const OpenAI = require('openai');

const init = (config) => {
    const openai = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
    });
    const chat = MakeChat(openai, config.chat)
    const createEmbedding = MakeCreateEmbedding(openai, config.embedding)
    return {
        chat,
        createEmbedding
    }
}

const MakeChat = (openai, config) => async (messages, options = {}) => {
    const completion = await openai.chat.completions.create({
        model: options.model || config.model,
        max_tokens: options.maxTokens || config.maxTokens,
        temperature: options.temperature || config.temperature,
        stream: false,
        messages: messages.map(message => ({
            role: message.role,
            content: [{
                type: 'text',
                text: message.content
            }]
        }))
    });
    const response = completion.choices[0].message.content
    if (!response) throw new Error("No response from llm")
    return response
}


const MakeCreateEmbedding = (openai, config) => async (text, options = {}) => {
    const response = await openai.embeddings.create({
        model: options.model || config.model,
        input: text,
    });
    if (!response) throw new Error("No response from llm")
    return response.data[0].embedding;
}

module.exports = { init }

