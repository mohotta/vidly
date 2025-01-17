const { Rental } = require('../../models/rentals')
const { Movie } = require('../../models/movies')
const mongoose = require('mongoose')

async function getAllRentals() {
    const result = await Rental.find().sort('-dateOut').select({ _id: 1, customer: 1, movie: 1, dateOut: 1, dateReturned: 1, rentalFee: 1 })
    return result
}

async function getRentalById(id) {
    const result = await Rental.findById(id).select({ _id: 1, customer: 1, movie: 1, dateOut: 1, dateReturned: 1, rentalFee: 1 })
    return result
}

async function addNewRental(rentalObj) {
    let rental = new Rental(rentalObj)
    // update movies object and save rental
    // TODO: in a atomic transaction
    await rental.save()
    const movie = await Movie.findById(rental.movie._id)
    movie.numberInStock--
    await movie.save()
    return rental
}

async function returnRental(rentalObj) {
    const rental = await Rental.findByIdAndUpdate(rentalObj._id, rentalObj, { new: true })
    const movie = await Movie.findById(rental.movie._id)
    movie.numberInStock++
    await movie.save()
    return rental
}

async function getRentalsByMovieAndCustomer(movieId, customerId) {
    return await Rental.find({ 
        "customer._id": customerId, 
        "movie._id": movieId 
    });
}

module.exports = {
    getAllRentals: getAllRentals,
    getRentalById: getRentalById,
    returnRental: returnRental,
    addNewRental: addNewRental,
    getRentalsByMovieAndCustomer: getRentalsByMovieAndCustomer,
}
 