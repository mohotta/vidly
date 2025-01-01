const mongoose = require('mongoose')
const Joi = require('joi')
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: { type: String, require: true, min: 3, max: 50 },
    email: { type: String, require: true, unique: true, min: 3, max: 255 },
    password: { type: String, require: true, min: 3, max: 1024 },
    isAdmin: { type: Boolean, require: true, default: false }
})
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.APP_JWT_KEY)
}

const User = mongoose.model('User', userSchema)

const validateUser = (user) => {
    schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(255).required(),
        password: joiPassword
            .string()
            .min(8)
            .minOfSpecialCharacters(1)
            .minOfLowercase(2)
            .minOfUppercase(2)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .required(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user)
}

module.exports = { 
    userSchema: userSchema,
    User: User,
    validate: validateUser
}
