const Joi = require('joi')
Joi.objctId = require('joi-objectid')(Joi)
const express = require('express')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const mongoose = require('mongoose')

require('dotenv').config()

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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})
