const OpenaiAdapter = require('./openai.adapter')

const create = (config) => {
    return OpenaiAdapter.init(config)
}

module.exports = {
    create
}