const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
    name: { type: String, require: true, minlength: 3 }
})
const Genre = mongoose.model('Genre', genreSchema)

function validateGenre(genre) {
    schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    })
    return schema.validate(genre)
}

module.exports = {
    genreSchema: genreSchema,
    Genre: Genre,
    validate: validateGenre
}
