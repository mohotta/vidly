const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const customerDb = require('../services/db/customers')
const { validate } = require('../models/customers')
const { isValidObjectId }  = require('../utils/utils')

const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const customers = await customerDb.getAllCustomers()
        res.send(customers)
    }
    catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('customer id is invalid!')
        }
        const customer = customerDb.getCustomerByID(req.params.id)
        if (!customer) {
            return res.status(404).send('customer not found!')
        }
        res.send(customer)
    }
    catch (err) {
        next(err)
    }
})

router.post('/', auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const customer = await customerDb.createCustomer(req.body)
        res.send(customer)
    }
    catch (err) {
        next(err)
    }
})

router.put('/:id', auth, async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('customer id is invalid!')
        }
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const customer = await customerDb.updateCustomer(req.params.id, req.body)
        if (!customer) {
            return res.status(404).send('customer not found!')
        }
        res.send(customer)
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:id', [auth, admin], async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('customer id is invalid!')
        }
        const customer = await customerDb.deleteCustomer(req.params.id)
        if (!customer) {
            return res.status(404).send('genre not found!')
        }
        res.send(customer)
    }
    catch (err) {
        next(err)
    }
})

module.exports = router
