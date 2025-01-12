const request = require('supertest')
const mongoose = require('mongoose')
const { Genre } = require('../../../models/genres');
const { User } = require('../../../models/users');


let server;
const url = '/api/genres'

describe(url, () => {
    
    beforeEach(() => {
        server = require('../../../index')
    })

    afterEach(async () => {
        server.close()
        await Genre.deleteMany({})
    })

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {
                    name: 'genre1'
                },
                {
                    name: 'genre2'
                }
            ])
            const res = await request(server).get(url)
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy()
            expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('should return the genre if valid id passed', async () => {
            let genre = new  Genre({
                name: 'genre1'
            })
            genre = await genre.save()
            const res = await request(server).get(`${url}/${genre._id}`)
            expect(res.status).toBe(200)
            expect(res.body).toEqual(expect.objectContaining({ name: 'genre1' }))
        })
        it('should give 404 error if objectId not found', async () => {
            const res = await request(server).get(`${url}/${new mongoose.Types.ObjectId()}`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {
        it('should give 400 error if name is shoter than 3 characters', async () => {
            const token = new User().generateAuthToken()
            const res = await request(server)
                .post(url)
                .set('x-auth-token', token)
                .send({ name: 'a' })
                expect(res.status).toBe(400)
        }) 
        it('should give 400 error if name is longer than 50 characters', async () => {
            const token = new User().generateAuthToken()
            const res = await request(server)
                .post(url)
                .set('x-auth-token', token)
                .send({ name: 'a'.repeat(51) })
            expect(res.status).toBe(400)
        }) 
        it('should create a genre in databse valid name passed', async () => {
            const token = new User().generateAuthToken()
            const res = await request(server)
                .post(url)
                .set('x-auth-token', token)
                .send({ name: 'genre1' })
                expect(res.status).toBe(200)
            const genre = Genre.find({ name: 'genre1' })
            expect(genre).not.toBeNull()
        }) 
        it('should return the created genre in response if valid name passed', async () => {
            const token = new User().generateAuthToken()
            const res = await request(server)
                .post(url)
                .set('x-auth-token', token)
                .send({ name: 'genre2' })
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("_id")
            expect(res.body).toHaveProperty("name", "genre2")
        })
    })

    describe('PUT /:id', () => {
        it('should give 404 error if genre not found', async () => {
            const token = new User().generateAuthToken()
            const res = await request(server)
                .put(`${url}/${new mongoose.Types.ObjectId()}`)
                .set('x-auth-token', token)
                .send({ name: 'genre1' })
                expect(res.status).toBe(404)
        }) 
        it('should give 400 error if name is shorter than 3 characters', async () => {
            const token = new User().generateAuthToken()
            const genre = new  Genre({
                name: 'genre1'
            })
            await genre.save()
            const res = await request(server)
                .put(`${url}/${genre._id}`)
                .set('x-auth-token', token)
                .send({ name: 'a' })
            expect(res.status).toBe(400)
        }) 
        it('should give 400 error if name is longer than 50 characters', async () => {
            const token = new User().generateAuthToken()
            const genre = new  Genre({
                name: 'genre1'
            })
            await genre.save()
            const res = await request(server)
                .put(`${url}/${genre._id}`)
                .set('x-auth-token', token)
                .send({ name: 'a'.repeat(51) })
            expect(res.status).toBe(400)
        }) 
        it('should update the genre in databse if valid name passed', async () => {
            const token = new User().generateAuthToken()
            const genre = new  Genre({
                name: 'genre1'
            })
            await genre.save()
            const res = await request(server)
                .put(`${url}/${genre._id}`)
                .set('x-auth-token', token)
                .send({ name: 'genre2' })
            expect(res.status).toBe(200)
            const newGenre = await Genre.findById(genre._id)
            expect(newGenre).toHaveProperty('name', 'genre2')
        }) 
        it('should send the updated genre in databse in response if valid name passed', async () => {
            const token = new User().generateAuthToken()
            const genre = new  Genre({
                name: 'genre1'
            })
            await genre.save()
            const res = await request(server)
                .put(`${url}/${genre._id}`)
                .set('x-auth-token', token)
                .send({ name: 'genre2' })
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id', genre._id.toHexString())
            expect(res.body).toHaveProperty('name', 'genre2')
        }) 
    })

    describe('DELETE /:id', () => {
        it('should give 404 error if genre not found', async () => {
            const token = new User({ isAdmin: true }).generateAuthToken()
            const res = await request(server)
                .delete(`${url}/${new mongoose.Types.ObjectId()}`)
                .set('x-auth-token', token)
                .send({ name: 'genre1' })
                expect(res.status).toBe(404)
        }) 
        it('should delete the genre in databse if valid name passed', async () => {
            const token = new User({ isAdmin: true }).generateAuthToken()
            const genre = new  Genre({
                name: 'genre1'
            })
            await genre.save()
            const res = await request(server)
                .delete(`${url}/${genre._id}`)
                .set('x-auth-token', token)
                .send({ name: 'genre2' })
            expect(res.status).toBe(200)
            const newGenre = await Genre.findById(genre._id)
            expect(newGenre).toBeNull()
        }) 
        it('should send the deleted genre in response if valid name passed', async () => {
            const token = new User({ isAdmin: true }).generateAuthToken()
            const genre = new  Genre({
                name: 'genre1'
            })
            await genre.save()
            const res = await request(server)
                .put(`${url}/${genre._id}`)
                .set('x-auth-token', token)
                .send({ name: 'genre2' })
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id', genre._id.toHexString())
            expect(res.body).toHaveProperty('name', 'genre2')
        }) 
    })

})
