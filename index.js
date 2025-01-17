const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const winston = require('winston')
const config = require('config')
const helmet = require('helmet')
const compression = require('compression')

// require('winston-mongodb')

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const returns = require('./routes/returns')
const errorHandler = require('./middleware/error')


if (!config.get("APP_JWT_KEY")) {
    console.error("FATAL ERROR: JWT private key is not defined!")
    process.exit(1)
}
if (!config.get("APP_DB_URL")) {
    console.error("FATAL ERROR: DB Url is not defined!")
    process.exit(1)
}

winston.add(new winston.transports.Console({ color: true }))
winston.add(new winston.transports.File({ filename: 'logfile.log' }))
// winston.add(new winston.transports.MongoDB({ db: process.env.APP_DB_URL, level: 'error' }))

process.on('uncaughtException', (ex) => {
    console.log('UNCAUGHT EXCEPTION!')
    winston.error(ex.message, ex)
    process.exit(1)
})
process.on('unhandledRejection', (ex) => {
    console.log('UNHANDLED PROMISE REJECTION!')
    winston.error(ex.message, ex)
    process.exit(1)
})

mongoose.connect(config.get("APP_DB_URL"))
    .then(() => winston.info('connected to mongodb!'))

const app = express()

app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/returns', returns)
app.use(errorHandler)
app.use(helmet)
app.use(compression)

p = Promise.resolve(new Error("sds"))
p.then(() => {})

const port = config.get("APP_PORT")|| 3000
const server = app.listen(port, () => {
    winston.info(`listening on port: ${port}`)
})

module.exports = server
