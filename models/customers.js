const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
    name: { type: String, require: true, minlenth: 3 },
    isGold: { type: Boolean, require: true },
    phone: { type: String, require: true, match: /^[0-9]+$/ }
})
const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
        isGold: Joi.boolean()
    })
    return schema.validate(customer)
}

module.exports = {
    customerSchema: customerSchema,
    Customer: Customer,
    validate: validateCustomer
}
