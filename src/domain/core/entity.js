"use strict"

class Entity {
    constructor(props) {
        this.id = props.id
    }

    static validate(props = {}) {
        const { id = null } = props
        if (id === null)
            throw new Error('Id is required')
    }

    equals(entity) {
        if (entity === null) return false
        if (entity === undefined) return false
        if (!(entity instanceof Entity)) return false
        if (this === entity) return true
        return this.id === entity.id
    }
}
module.exports = Entity;