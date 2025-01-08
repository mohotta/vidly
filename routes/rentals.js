const express = require('express')
const auth = require('../middleware/auth')
const validateObjectId = require('../middleware/validateObjectId')
const rentalsDb = require('../services/db/rentals')
const customerDb = require('../services/db/customers')
const moviesdB = require('../services/db/movies')
const { validate } = require('../models/rentals')


const router = express.Router()

// get rental list
router.get('/', async (req, res, next) => {
    try {
        const rentals = await rentalsDb.getAllRentals()
        res.send(rentals)
    }
    catch (err) {
        next(err)
    }
}) 

// get a single rental
router.get('/:id', validateObjectId, async (req, res, next) => {
    try {
        const rental = await rentalsDb.getRentalById(req.params.id)
        if (!rental) {
            return res.status(404).send('genre not found!')
        }
        res.send(rental)
    }
    catch (err) {
        next(err)
    }
})

// add new rental
router.post('', auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const customer = await customerDb.getCustomerByID(req.body.customerId)
        if (!customer) {
            return res.status(400).send('Customer not found!')
        }
        const movie = await moviesdB.getMovieById(req.body.movieId)
        if (!movie) {
            return res.status(400).send('Movie not found!')
        }
        if (movie.numberInStock === 0) {
            return res.status(400).send('No copies available to rent!')
        }
        rentalObj = { ...req.body }
        rentalObj.customer = {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        }
        rentalObj.movie = {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
        const result = await rentalsDb.addNewRental(rentalObj)
        res.send(result)
    }
    catch (err) {
        next(err)
    }
})

module.exports = router
 