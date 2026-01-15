const express = require("express");
const {
  signupHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
} = require("../controllers/auth.controller");
const { authHandler } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validator.middleware");
const { signupSchema, loginSchema } = require("../validators/auth.validator");
const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signupHandler);
authRouter.post("/login", validate(loginSchema), loginHandler);
authRouter.post("/logout", authHandler, logoutHandler);
authRouter.post("/refresh", refreshHandler, getAcc);

module.exports = authRouter;
