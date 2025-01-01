const { Genre } = require('../../models/genres')

async function getAllGenres() {
    const result = await Genre.find().sort('name').select({ _id: 1, name: 1 })
    return result
}

async function getGenreById(id) {
    const result = await Genre.findById(id).select({ _id: 1, name: 1 })
    return result
}

async function addNewGenre(genreObj) {
    let genre = new Genre(genreObj)
    genre = await genre.save()
    return genre
}

async function updateGenre(id, genre) {
    const result = await Genre.findByIdAndUpdate(id, genre, { new: true }).select({ _id: 1, name: 1 })
    return result
}

async function deleteGenre(id) {
    const result = await Genre.findByIdAndDelete(id).select({ _id: 1, name: 1 })
    return result
}

module.exports = {
    getAllGenres: getAllGenres,
    getGenreById: getGenreById,
    addNewGenre: addNewGenre,
    updateGenre: updateGenre,
    deleteGenre: deleteGenre
}
