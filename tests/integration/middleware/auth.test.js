const request = require('supertest')
const { Genre } = require('../../../models/genres');
const { User } = require('../../../models/users');


let server;
const url = '/api/genres'

describe('auth middleware', () => {
    
    beforeEach(() => {
        server = require('../../../index')
    })

    afterEach(async () => {
        server.close()
        await Genre.deleteMany({})
    })

    it('should give 401 error if user is not logged in', async () => {
        const res = await request(server)
            .post(url)
            .send({ name: 'genre1' })
        expect(res.status).toBe(401)
    }) 
    it('should give 400 error if token is invalid', async () => {
        const token = '1234'
        const res = await request(server)
            .post(url)
            .set('x-auth-token', token)
            .send({ name: 'genre2' })
        expect(res.status).toBe(400)
    }) 
    it('should create a genre in if valid token passed', async () => {
        const token = new User().generateAuthToken()
        const res = await request(server)
            .post(url)
            .set('x-auth-token', token)
            .send({ name: 'genre1' })
        expect(res.status).toBe(200)
    })
    
})
