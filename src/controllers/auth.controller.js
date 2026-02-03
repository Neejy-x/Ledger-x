const AuthService = require("../service/auth.service");

exports.signupHandler = async (req, res) => {
  const payload = req.body;
  //fetch user and tokens from auth service
  const { user, refreshToken, accessToken } = await AuthService.signup(payload);

  //assign refresh token to cookies
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: "Success",
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
    },
    accessToken,
  });
};

exports.loginHandler = async(req, res) => {
    const payload = req.body

    const { user, refreshToken, accessToken} = await AuthService.login(payload)

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        status: 'Success',
        message: 'login Successful',
        user: {
            name: user.full_name,
            email: user.email
        },
        accessToken
    })
}

exports.logoutHandler = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt){
        return res.sendStatus(204)
    }
    const refreshToken = cookies.jwt
    await AuthService.logout(refreshToken)
    res.clearCookie('jwt', {
        httpOnly: true, 
        secure: process.env.NODE_ENV == 'production'
    })

    res.status(200).json({
        message: 'Logout successful'
    })
}

exports.refreshHandler = async (req, res) => {
const cookies = req.cookies
if(!cookies?.jwt) return res.sendStatus(401)

const refreshToken = cookies.jwt 
const{ accessToken, newRefreshToken, user} = await AuthService.refresh(refreshToken)

res.cookie('jwt', newRefreshToken,{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
})

res.status(200).json({
    status: 'Successful',
    user: 
    {
        name: user.full_name,
        email: user.email
    },
    accessToken
})
}
