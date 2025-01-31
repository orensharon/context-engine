"use strict"

const cors = require('cors')
const express = require('express')

module.exports = [
    express.json(),
    express.urlencoded({ extended: true }),
    cors()
]