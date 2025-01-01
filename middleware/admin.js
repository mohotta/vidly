
function admin(req, res, next) {

    if (!req.user.isAdmin)
        return res.status(403).send('action not permitted!')
    next()

}

module.exports = admin
