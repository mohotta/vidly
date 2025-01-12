const { User } = require('../../../models/users')
const mongoose = require('mongoose')
const auth = require('../../../middleware/auth')

describe('auth middleware', () => {
    it('should populate request.user with payload of a valid JWT', () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        const user = new User({
            _id: id,
            isAdmin: true
        })
        const token = user.generateAuthToken()
        
        req = {
            header: jest.fn().mockReturnValue(token)
        }
        res = {}
        next = jest.fn()
        auth(req, res, next)
        
        expect(req.user).toBeDefined()
        expect(req.user).toHaveProperty('_id', id)
        expect(req.user).toHaveProperty('isAdmin', true)
    })
})
