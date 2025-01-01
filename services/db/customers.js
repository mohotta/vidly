const { Customer } = require('../../models/customers')

async function getAllCustomers() {
    const customers = await Customer.find().sort('name').select({ _id: 1, name: 1, isGold: 1, phone: 1 })
    return customers
}

async function getCustomerByID(id) {
    const customer = Customer.findById(id).select({ _id: 1, name: 1, isGold: 1, phone: 1 })
    return customer
}

async function createCustomer(customerObj) {
    let customer = new Customer(customerObj)
    customer = await customer.save()
    return customer
}

async function updateCustomer(id, customerObj) {
    const customer = Customer.findByIdAndUpdate(id, customerObj, { new: true })
                                .select({ _id: 1, name: 1, isGold: 1, phone: 1 })
    return customer
}

async function deleteCustomer(id) {
    const customer = Customer.findByIdAndDelete(id)
                                .select({ _id: 1, name: 1, isGold: 1, phone: 1 })
    return customer
}

module.exports = {
    getAllCustomers: getAllCustomers,
    getCustomerByID: getCustomerByID,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer
}
