const mongoose = require('mongoose')
const { customerSchema } = require('./customers')
const { movieSchema } = require('./movies')
const Joi = require('joi')


const rentalSchema = new mongoose.Schema({
    customer: { type: customerSchema, require: true },
    movie: { type: movieSchema, require: true },
    dateOut: { type: Date, require: true, default: Date.now() },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 }
})


rentalSchema.methods.processReturn = function(goldDiscount=0.8) {
    this.dateReturned = Date.now()
    const fee = Math.round((Date.parse(this.dateReturned) - Date.parse(this.dateOut)) / (1000 * 3600 * 24)) * this.movie.dailyRentalRate
    this.rentalFee = fee * (this.customer.isGold? goldDiscount: 1.0)
}

const Rental = mongoose.model('Rental', rentalSchema)

function validateRental(rental) {
    schema = Joi.object({
        customerId: Joi.objectId().required().messages({
            "any.only": `"" is a invalid customer id`
        }),
        movieId: Joi.objectId().required().messages({
            "any.only": `"" is a invalid movie id`
        })
    })
    return schema.validate(rental)
}

module.exports = {
    Rental: Rental,
    validate: validateRental
}
