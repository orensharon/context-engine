"use strict"

const SubjectRoutes = require('./subject.routes')
const DocumentRoutes = require('./subject.document.routes')

const init = (path, service) => {
    const routes = []
    const subject = SubjectRoutes.init(service)
    const document = DocumentRoutes.init('documents', service)


    routes.push(
        ...subject,
        ...document
    )

    return {
        path,
        routes
    }
}

module.exports = { init }
