const express = require('express')
const auth = require('../middleware/auth')
const rentalsDb = require('../services/db/rentals')
const { validate } = require('../models/rentals')


const router = express.Router()

// return a movie
router.post("/", auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        // there can be customers who rent same movie multiple times
        let rentals = await rentalsDb.getRentalsByMovieAndCustomer(req.body.movieId, req.body.customerId)
        if (rentals.length <= 0) {
            return res.status(404).send('no rentals found!')
        }
        if (rentals.every(rental => !!rental.dateReturned)) {
            return res.status(400).send('no pending returns for this customer+movie combination')
        }
        let rental = rentals.filter(rental => !rental.dateReturned)[0]
        rental.processReturn()
        rental = await rentalsDb.returnRental(rental)
        res.send({ rentalFee: rental.rentalFee })
    }
    catch (err) {
        next(err)
    }
})

module.exports = router