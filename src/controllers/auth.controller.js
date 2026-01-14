const {User} = require('../database/models')
const jwt = require('jsonwebtoken')

export const signupHandler = async (req, res) => {

const { first_name, last_name, email, password } = req.body

const userExists = await User.findOne({where: {email}})

if(userExists) return res.status(409).json({message: 'User already exists'})

const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    
})

}