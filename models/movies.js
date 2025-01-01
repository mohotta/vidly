const mongoose = require('mongoose')
const { genreSchema } = require('./genres')
const Joi = require('joi')

const movieSchema = new mongoose.Schema({
    title: { type: String, require: true, minlength: 3 },
    genre: { type: genreSchema, require: true },
    numberInStock: { type: Number, require: true },
    dailyRentalRate: { type: Number, require: true }
})
const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie) {
    schema = Joi.object({
        title: Joi.string().min(3).required(),
        genreId: Joi.objectId().required().message({
            "string.pattern.base": `"" is a invalid genre id`
        }),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    })
    return schema.validate(movie)
}

module.exports = {
    movieSchema: movieSchema,
    Movie: Movie,
    validate: validateMovie
}
