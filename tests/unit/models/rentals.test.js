const { Rental } = require('../../../models/rentals')
const config = require('config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { Movie } = require('../../../models/movies')
const { Customer } = require('../../../models/customers')

describe('rental.calculateRentalFee', () => {
    it('should calculate rental fee correctly', () => {
        const date = new Date()
        const rental = new Rental({
            movie: new Movie({
                genre: new mongoose.Types.ObjectId(),
                title: 'a',
                numberInStock: 1,
                dailyRentalRate: 1.0,
            }),
            customer: new Customer({
                name: 'a',
                phone: 'b',
                isGold: false
            }),
            dateOut: date.setDate(date.getDate() - 10)
        })
        rental.processReturn()
        expect(rental.rentalFee).toBe(10)
    })
    it('should apply discount if customer is gold', () => {
        const date = new Date()
        const discount = 0.8
        const rental = new Rental({
            movie: new Movie({
                genre: new mongoose.Types.ObjectId(),
                title: 'a',
                numberInStock: 1,
                dailyRentalRate: 1.0,
            }),
            customer: new Customer({
                name: 'a',
                phone: 'b',
                isGold: true
            }),
            dateOut: date.setDate(date.getDate() - 10)
        })
        rental.processReturn(discount)
        expect(rental.rentalFee).toBe(8)
    })
})
