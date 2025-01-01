const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const customerDb = require('../services/db/customers')
const { validate } = require('../models/customers')
const { isValidObjectId }  = require('../utils/utils')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const customers = await customerDb.getAllCustomers()
        res.send(customers)
    }
    catch (err) {
        res.send(err.message)
    }
})

router.get('/:id', async (req, res) => {
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
        res.send(err.message).status(500)
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const customer = await customerDb.createCustomer(req.body)
        res.send(customer)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

router.put('/:id', auth, async (req, res) => {
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
        res.send(err.message)
    }
})

router.delete('/:id', [auth, admin], async (req, res) => {
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
        res.send(err.message)
    }
})

module.exports = router
