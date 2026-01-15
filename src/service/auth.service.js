const { User, sequelize } = require("../database/models");

class AuthService{

static  async signup (payload){
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
    const user = await User.findOne({where: {email: payload.email}})
    if(!user){
        const e = new Error('Invalid email or password')
        e.statusCode = 409
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

    await user.createRefreshToken({token: refreshToken})

    return{user, accessToken, refreshToken}

    }catch(e){
    throw e;
    }

}
}

module.exports = AuthService