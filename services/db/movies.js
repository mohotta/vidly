const { Movie } = require('../../models/movies')
const { Genre } = require('../../models/genres')

async function getAllMovies() {
    const result = await Movie.find().sort('title').select({ _id: 1, title: 1, genre: 1, numberInStock: 1, dailyRentalRate: 1 })
    return result
}

async function getMovieById(id) {
    const result = await Movie.findById(id).select({ _id: 1, title: 1, genre: 1, numberInStock: 1, dailyRentalRate: 1 })
    return result
}

async function addNewMovie(movieObj) {
    let movie = new Movie(movieObj)
    movie = await movie.save()
    return movie
}

async function updateMovie(id, movie) {
    const result = await Movie.findByIdAndUpdate(id, movie, { new: true }).select({ _id: 1, title: 1, genre: 1, numberInStock: 1, dailyRentalRate: 1 })
    return result
}

async function deleteMovie(id) {
    const result = await Movie.findByIdAndDelete(id).select({ _id: 1, title: 1, genre: 1, numberInStock: 1, dailyRentalRate: 1 })
    return result
}

module.exports = {
    getAllMovies: getAllMovies,
    getMovieById: getMovieById,
    addNewMovie: addNewMovie,
    updateMovie: updateMovie,
    deleteMovie: deleteMovie
}
