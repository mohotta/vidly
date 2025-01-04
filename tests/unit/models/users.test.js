require('dotenv').config()
const { User } = require('../../../models/users')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

describe('user.generateAuthToken', () => {
    it('should return a valid JWT token', () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        const user = new User({
            _id: id,
            isAdmin: true
        })
        const token = user.generateAuthToken()
        const payload = jwt.verify(token, process.env.APP_JWT_KEY)
        expect(payload).toMatchObject({ _id: id, isAdmin: true })
    })
})
