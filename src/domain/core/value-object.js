"use strict"
const { isDeepStrictEqual } = require('util');

class ValueObject {
    constructor(props) {

    }

    static validate(props) {
        return null
    }

    equals(vo) {
        if (vo === null) return false
        if (vo === undefined) return false
        if (this === vo) return true
        return isDeepStrictEqual(this, vo)
    }
}
module.exports = ValueObject;