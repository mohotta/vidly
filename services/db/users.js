const { User } = require('../../models/users')

async function getUserByEmail(email) {
    const user = await User.findOne({ email: email })
    return user
}

async function getUserByID(id) {
    const user = await User.findById(id).select({ _id: 1, name: 1, email: 1 })
    return user
}

async function createUser(userObj) {
    let user = new User(userObj)
    user = await user.save()
    return user
}

module.exports = {
    getUserByEmail: getUserByEmail,
    getUserByID: getUserByID,
    createUser: createUser
}
