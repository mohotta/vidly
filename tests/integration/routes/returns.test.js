const request = require('supertest')
const mongoose = require('mongoose')
const { Rental } = require('../../../models/rentals');
const { Movie } = require('../../../models/movies');
const { Customer } = require('../../../models/customers');
const { User } = require('../../../models/users');


let server;
const url = '/api/returns'

describe(url, () => {
    
    beforeEach(() => {
        server = require('../../../index')
    })

    afterEach(async () => {
        server.close()
        await Rental.deleteMany({})
    })

    describe('POST /', () => {
        it('should create the movie return and return rentalFee', async () => {
            const token = new User().generateAuthToken()
            const date = new Date()
            let movie = new Movie({
                genre: new mongoose.Types.ObjectId(),
                title: 'movie1',
                numberInStock: 1,
                dailyRentalRate: 1.0,
            })
            await movie.save()
            const rental = new Rental({
                movie: movie,
                customer: new Customer({
                    name: 'customer1',
                    phone: '1234',
                    isGold: false
                }),
            })
            await rental.save()
            movie = await Movie.findById(rental.movie._id)
            movie.numberInStock--
            await movie.save()

            const res = await request(server)
                .post(url)
                .set('x-auth-token', token)
                .send({
                    movieId: rental.movie._id,
                    customerId: rental.customer._id
                })

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('rentalFee')
        })
        it('should create the movie return and update movie inventory count', async () => {
            const token = new User().generateAuthToken()
            const date = new Date()
            let movie = new Movie({
                genre: new mongoose.Types.ObjectId(),
                title: 'movie1',
                numberInStock: 1,
                dailyRentalRate: 1.0,
            })
            await movie.save()
            const rental = new Rental({
                movie: movie,
                customer: new Customer({
                    name: 'customer1',
                    phone: '1234',
                    isGold: false
                }),
            })
            await rental.save()
            movie = await Movie.findById(rental.movie._id)
            movie.numberInStock--
            await movie.save()

            const res = await request(server)
                .post(url)
                .set('x-auth-token', token)
                .send({
                    movieId: rental.movie._id,
                    customerId: rental.customer._id
                })

            movie = await Movie.findById(rental.movie._id)
            expect(movie.numberInStock).toBe(1)
        })
        it('should give error 400 if rental already returned', async () => {
            const token = new User().generateAuthToken()
            const date = new Date()
            let movie = new Movie({
                genre: new mongoose.Types.ObjectId(),
                title: 'movie1',
                numberInStock: 1,
                dailyRentalRate: 1.0,
            })
            await movie.save()
            const rental = new Rental({
                movie: movie,
                customer: new Customer({
                    name: 'customer1',
                    phone: '1234',
                    isGold: false
                }),
                dateReturned: Date.now(),
                rentalFee: 10
            })
            await rental.save()

            const res = await request(server)
                .post(url)
                .set('x-auth-token', token)
                .send({
                    movieId: rental.movie._id,
                    customerId: rental.customer._id
                })

            expect(res.status).toBe(400)
        })
    })
})
