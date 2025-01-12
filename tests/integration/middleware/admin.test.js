const request = require('supertest')
const { Genre } = require('../../../models/genres');
const { User } = require('../../../models/users');


let server;
const url = '/api/genres'

describe('admin middleware', () => {
    
    beforeEach(() => {
        server = require('../../../index')
    })

    afterEach(async () => {
        server.close()
        await Genre.deleteMany({})
    })

    it('should give 403 error if user is not admin', async () => {
        const genre = new Genre({ name: 'genre1' })
        await genre.save()
        const token = new User({ isAdmin: false }).generateAuthToken()
        const res = await request(server)
            .delete(`${url}/${genre._id}`)
            .set('x-auth-token', token)
        expect(res.status).toBe(403)
    }) 
    it('should delete genre if user is admin', async () => {
        const genre = new Genre({ name: 'genre1' })
        await genre.save()
        const token = new User({ isAdmin: true }).generateAuthToken()
        const res = await request(server)
            .delete(`${url}/${genre._id}`)
            .set('x-auth-token', token)
        expect(res.status).toBe(200)
    }) 
    
})
