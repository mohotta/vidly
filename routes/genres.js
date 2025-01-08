const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')
const genreDb = require('../services/db/genres')
const { validate } = require('../models/genres')

const router = express.Router()

// get genre list
router.get('/', async (req, res, next) => {
    try {
        const genres = await genreDb.getAllGenres()
        res.send(genres)
    }
    catch (err) {
        next(err)
    }
}) 

// get a single genre
router.get('/:id', validateObjectId, async (req, res, next) => {
    try {
        const genre = await genreDb.getGenreById(req.params.id)
        if (!genre) {
            return res.status(404).send('genre not found!')
        }
        res.send(genre)
    }
    catch (err) {
        next(err)
    }
})

// add new genre
router.post('', auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const result = await genreDb.addNewGenre(req.body)
        res.send(result)
    }
    catch (err) {
        next(err)
    }
})

// edit a genere
router.put('/:id', [auth, validateObjectId], async (req, res, next) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const genre = await genreDb.updateGenre(req.params.id, req.body)
        if (!genre) {
            return res.status(404).send('genre not found!')
        }
        res.send(genre)
    }
    catch (err) {
        next(err)
    }
})

// delete a genre
router.delete('/:id', [auth, admin, validateObjectId], async (req, res, next) => {
    try {const genre = await genreDb.deleteGenre(req.params.id)
        if (!genre) {
            return res.status(404).send('genre not found!')
        }
        res.send(genre)
    }
    catch (err) {
        next(err)
    }
})

module.exports = router
