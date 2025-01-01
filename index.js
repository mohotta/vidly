const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objctId = require('joi-objectid')(Joi)
const winston = require('winston')
require('winston-mongodb')
require('dotenv').config()

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const errorHandler = require('./middleware/error')


winston.add(new winston.transports.File({ filename: 'logfile.log' }))
winston.add(new winston.transports.MongoDB({ db: process.env.APP_DB_URL, level: 'error' }))

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

mongoose.connect(process.env.APP_DB_URL)
    .then(() => console.log('connected to mongodb!'))
    .catch(err => console.log(err))

const app = express()

app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use(errorHandler)

p = Promise.resolve(new Error("sds"))
p.then(() => {})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})
