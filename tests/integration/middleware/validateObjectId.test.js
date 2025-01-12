const request = require('supertest')
const { Genre } = require('../../../models/genres');


let server;
const url = '/api/genres'

describe('validateObjectId middleware', () => {
    
    beforeEach(() => {
        server = require('../../../index')
    })

    afterEach(async () => {
        server.close()
        await Genre.deleteMany({})
    })

    it('should give 400 error if objectId is invalid', async () => {
        const res = await request(server).get(`${url}/1234`)
        expect(res.status).toBe(400)
    })
    it('should handle request to next middleware if objectId is valid', async () => {
        let genre = new  Genre({
            name: 'genre1'
        })
        genre = await genre.save()
        const res = await request(server).get(`${url}/${genre._id}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({ name: 'genre1' }))
    })

})