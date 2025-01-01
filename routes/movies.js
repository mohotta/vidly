const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const moviesDb = require('../services/db/movies')
const genreDb = require('../services/db/genres')
const { validate } = require('../models/movies')
const { isValidObjectId }  = require('../utils/utils')

const router = express.Router()

// get movie list
router.get('/', async (req, res, next) => {
    try {
        const movies = await moviesDb.getAllMovies()
        res.send(movies)
    }
    catch (err) {
        next(err)
    }
}) 

// get a single movie
router.get('/:id', async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('movie id is invalid!')
        }
        const movie = await moviesDb.getMovieById(req.params.id)
        if (!movie) {
            return res.status(404).send('Movie not found!')
        }
        res.send(movie)
    }
    catch (err) {
        next(err)
    }
})

// add new movie
router.post('', auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const genre = await genreDb.getGenreById(req.body.genreId)
        console.log(genre)
        if (!genre) {
            return res.status(400).send('Genre not found!')
        }
        movieObj = { ...req.body }
        movieObj.genre = {
            _id: genre._id,
            name: genre.name
        }
        const result = await moviesDb.addNewMovie(movieObj)
        res.send(result)
    }
    catch (err) {
        next(err)
    }
})

// edit a movie
router.put('/:id', auth, async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('movie id is invalid!')
        }
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const genre = await moviesDb.updateMovie(req.params.id, req.body)
        if (!genre) {
            return res.status(404).send('genre not found!')
        }
        res.send(genre)
    }
    catch (err) {
        next(err)
    }
})

// delete a movie
router.delete('/:id', [auth, admin], async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('movie id is invalid!')
        }
        const genre = await moviesDb.deleteMovie(req.params.id)
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
