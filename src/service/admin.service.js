const {Users } = require('../database/models')

const getUsers = async() => {
    return await Users.findAll({ attributes: { include: ['id', 'fullName', 'email']}});
}