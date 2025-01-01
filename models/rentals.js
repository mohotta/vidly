const mongoose = require('mongoose')
const { customerSchema } = require('./customers')
const { movieSchema } = require('./movies')
const Joi = require('joi')

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: { type: customerSchema, require: true },
    movie: { type: movieSchema, require: true },
    dateOut: { type: Date, require: true, default: Date.now() },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 }
}))

function validateRental(movie) {
    schema = Joi.object({
        customerId: Joi.objectId().required().message({
            "string.pattern.base": `"" is a invalid customer id`
        }),
        movieId: Joi.objectId().required().message({
            "string.pattern.base": `"" is a invalid movie id`
        })
    })
    return schema.validate(movie)
}

module.exports = {
    Rental: Rental,
    validate: validateRental
}
