const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const genreDb = require('../services/db/genres')
const { validate } = require('../models/genres')
const { isValidObjectId }  = require('../utils/utils')

const router = express.Router()

// get genre list
router.get('/', async (req, res) => {
    try {
        const genres = await genreDb.getAllGenres()
        res.send(genres)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}) 

// get a single genre
router.get('/:id', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('genre id is invalid!')
        }
        const genre = await genreDb.getGenreById(req.params.id)
        if (!genre) {
            return res.status(404).send('genre not found!')
        }
        res.send(genre)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

// add new genre
router.post('', auth, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const result = await genreDb.addNewGenre(req.body)
        res.send(result)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

// edit a genere
router.put('/:id', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('genre id is invalid!')
        }
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
        res.send(err.message)
    }
})

// delete a genre
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            res.status(403).send('need admin permission to perform this action!')
        }
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('genre id is invalid!')
        }
        const genre = await genreDb.deleteGenre(req.params.id)
        if (!genre) {
            return res.status(404).send('genre not found!')
        }
        res.send(genre)
    }
    catch (err) {
        res.send(err.message)
    }
})

module.exports = router
