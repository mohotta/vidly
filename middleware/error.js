
function errorHandler(err, req, res, next) {
    // logging
    res.status(500).send('something went wrong!')
}

module.exports = errorHandler
