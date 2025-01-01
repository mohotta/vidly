const express = require('express')
const { validate: validateUser } = require('../models/users')
const _ = require('lodash')
const userDb = require('../services/db/users')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/me', auth, async (req, res, next) => {
    try {
        const userId = req.user._id
        const user = await userDb.getUserByID(userId)
        if (!user) {
            return res.status(401).send('user not found!')
        }
        console.log(user)
        res.send(user)
    }
    catch (error) {
        next(error)
    }
})

router.post('/signin', async (req, res, next) => {
    try {
        const { error } = validateLogin(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        let user = await userDb.getUserByEmail(req.body.email)
        if (!user) {
            return res.status(400).send("invalid email or password!")
        }
        const isValid = await bcrypt.compare(req.body.password, user.password)
        if (!isValid) {
            return res.status(400).send("invalid email or password!")
        }
        
        res.header('x-auth-token', user.generateAuthToken()).send('logged in!')
    }
    catch (error) {
        next(error)
    }
}) 

router.post('/signup', async (req, res, next) => {
    try {
        const { error } = validateUser(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        let user = await userDb.getUserByEmail(req.body.email)
        if (user) {
            return res.status(400).send("user already registered!")
        }
        user = _.pick(req.body, ['name', 'email', 'password'])
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        user = await userDb.createUser(user)

        res.header('x-auth-token', user.generateAuthToken()).send(_.pick(user, ['_id', 'name', 'email']))
    }
    catch (error) {
        next(error)
    }
})


function validateLogin(user) {
    schema = Joi.object({
        email: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(3).max(255).required()
    })

    return schema.validate(user)
}

module.exports = router
