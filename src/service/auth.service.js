const { config } = require("dotenv");
const { User, Refresh_token, sequelize } = require("../database/models");
const jwt = require('jsonwebtoken')



class AuthService{

/**
 * Register a new user
 * @param {Object} payload - Signup data/signin data
 * @param {string} payload.email - User email
 * @param {string} payload.password - User password
 * @param {string} payload.first_name - User first name
 * @param {string} payload.last_name - User last name
 * @param {string} payload.pin - User transaction pin
 * @returns {Promise<Object>} Created user and tokens
 */

static  async signup (payload){
  console.log({
        ACCESS: process.env.ACCESS_TOKEN_SECRET,
        REFRESH: process.env.REFRESH_TOKEN_SECRET})
  const transaction = await sequelize.transaction();
  try {
    //verify user does not exist
    const existing = await User.findOne({ where: { email: payload.email } }, {transaction});
    if (existing) {
      const e = new Error("user already exists");
      e.statusCode = 409;
      throw e;
    }

    //create user
    const user = await User.create(payload, { transaction });

    //generate tokens
    const accessToken = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({id: user.id, role: user.role}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await user.createRefreshToken(
      { token: refreshToken },
      { transaction }
    );

    await transaction.commit()
    return {user, refreshToken, accessToken}
  } catch (e) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw e;
  }
};




static async login(payload){
    try{
    const user = await User.scope('withSecret').findOne({where: {email: payload.email}})
    if(!user){
        const e = new Error('Invalid email or password')
        e.statusCode = 401
        throw e
    }
    const isValid = await user.validatePassword(payload.password)
    if(!isValid){
        const e = new Error('Invalid email or password')
        e.statusCode = 401
        throw e;
    } 

    const accessToken = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

    const refreshToken = jwt.sign({id: user.id, role: user.role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})

    await Refresh_token.destroy({where: {user_id: user.id}})
    await user.createRefreshToken({token: refreshToken})

    return{user, accessToken, refreshToken}

    }catch(e){
    throw e;
    }

}

static async logout(refreshToken){
    
    try{

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findByPk(decoded.id, {include: {model: Refresh_token, as: 'refreshTokens'}})

    if(!user){
        const e = new Error('Invalid user')
        e.statusCode = 401
        throw e;
    }

    const token = await user.refreshTokens.find(t => t.validateToken(refreshToken))
    if(token) await token.destroy()
    return true
    }catch(e){
        if(e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
            const e = new Error('Invalid Token')
            e.statusCode = 403
            throw e
        }
    throw e
    }
}


static async refresh(refreshToken){
     
    try{
    //decode token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    //find associated user
    const user = await User.findByPk(decoded.id, {include: {model: Refresh_token, as: 'refreshTokens'}})

    if(!user){
        const e = new Error('Invalid user')
        e.statusCode = 401
        throw e
    }

 
    //find token
    const token = user.refreshTokens.find(t => t.validate(refreshToken))
    //clear tokens and force logout
    if(!token){
       await Refresh_token.destroy({where: {user_id: user.id}})
       const e = new Error('Invalid refresh token')
        e.statusCode = 403
        throw e
    }
    //enforce token rotation
    await token.destroy()
    //generate new tokens
    const newRefreshToken = jwt.sign({id: user.id, role: user.role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
    await user.createRefreshToken({token: newRefreshToken})
    const accessToken = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

    return {user, accessToken, newRefreshToken}
    }catch(e){
     if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        const e = new Error('Invalid or expired refresh token')
        e.statusCode = 403
        throw e
    }
    throw e
    }
}

}

module.exports = AuthService