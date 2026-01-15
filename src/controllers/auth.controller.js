const AuthService = require("../service/auth.service");

export const signupHandler = async (req, res) => {
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
