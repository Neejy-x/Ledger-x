const {User } = require('../database/models')

 exports.getUsers = async() => {
    return await User.findAll({ attributes: { include: ['id', 'fullName', 'email']}});
}

exports.updateUserRole = async({userId, role}) => {
    const user = await User.findByPk(userId)
    if(!user){
        const e = new Error('User not found')
        e.statusCode = 404
        throw e
    }

    user.role = role
    await user.save()
    return user
}