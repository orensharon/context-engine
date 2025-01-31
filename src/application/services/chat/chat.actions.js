"use strict"

const { GenerateId } = require('../../../utils')
const { ResourceNotFoundError, AuthorizationError } = require('../../../errors')
const { Chat } = require('../../../domain/models')


const init = (deps) => {

    const ensureChatExists = MakeEnsureChatExists({
        repository: deps.repository,
        subjectService: deps.subjectService
    })
    const sendMessage = MakeSendMessage({
        repository: deps.repository,
        subjectService: deps.subjectService,
        contextEngine: deps.contextEngine,
        ensureChatExists,
    })

    return {
        commands: {
            sendMessage
        },
        queries: {}
    }
}

const MakeEnsureChatExists = (deps) => async (props) => {
    const { repository, subjectService } = deps;
    const { subjectId, chatId } = props;
    const subject = await subjectService.queries.getById(subjectId);
    if (!subject) throw new ResourceNotFoundError("Subject not found", { id: subjectId });
    let chat = null;
    if (chatId) {
        chat = await repository.findById(chatId);
        if (!chat) throw new ResourceNotFoundError("Chat not found", { id: chatId });
        if (chat.subjectId !== subject.id)
            throw new AuthorizationError("Invalid subjectId for this chat"), { chatId, subjectId };
    }
    if (chat) return chat;
    const timestamp = Date.now();
    const id = GenerateId();
    chat = Chat.create({ id, subjectId, timestamp, });
    await repository.store(chat);
    return chat;

};

const MakeSendMessage = (deps) => async (props) => {
    const { repository, ensureChatExists, contextEngine, subjectService } = deps
    const chat = await ensureChatExists({
        subjectId: props.subjectId,
        chatId: props.chatId
    })
    const subject = await subjectService.queries.getById(chat.subjectId);
    if (!subject) throw new ResourceNotFoundError("Subject not found", { id: chat.subjectId });
    const timestamp = Date.now();
    const { content } = props.message;
    const message = chat.addUserPrompt(content, timestamp);
    const systemPrompts = {
        queries: [
            "Based on the user's question, generate 3-5 possible search queries to the question.",
            "Return only the queries, one per line, without numbering or additional text.",
        ],
        answer: [
            "You are a documentation expert. Review the retrieved contexts and the user's question.",
            "Answer the user's question based on the contexts below.",
            "There should be single answer without additional information about how did you got to the answer.",
            "Don't ask for additional information.",
            "If the user's question is not clear, answer only with insufficient."
        ]
    }
    const result = await contextEngine.query(subject.id, {
        systemPrompts,
        userPrompt: message.content
    })
    console.log(result)
    await repository.store(chat);
    return result;
}

module.exports = { init }
