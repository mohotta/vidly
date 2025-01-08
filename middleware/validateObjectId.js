const mongoose = require('mongoose')

function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Object id is invalid!')
    }
    next()
}

module.exports = validateObjectId
