const { Router } = require("express");
const {
  userSignUp,
  userSignIn,
  userLogOut,
} = require("../controllers/user.controller");

const userRouter = Router();

userRouter.get("/signin", (req, res) => {
  res.render("signin");
});

userRouter.get("/signup", (req, res) => {
  res.render("signup");
});

userRouter.post("/signup", userSignUp);
userRouter.post("/signin", userSignIn);
userRouter.get("/logout", userLogOut);

module.exports = userRouter;
