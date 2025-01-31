"use strict"

const log = (error) => {
    const fatal = error.fatal === true
    const operational = error.operational
    if (fatal) return console.error(error)
    if (operational) return console.warn(error)
    console.error(error)
}

module.exports = { log }