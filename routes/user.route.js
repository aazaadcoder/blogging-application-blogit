const { Router } = require("express");
const {
  userSignUp,
  userSignIn,
  userLogOut,
} = require("../controllers/user.controller");
const { getAllUserBlogs } = require("../controllers/blog.controller");
const { restrictToLogin } = require("../middlewares/authentication.middleware");

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

userRouter.get("/my-blogs", restrictToLogin("token") , getAllUserBlogs("createdAt", -1))

module.exports = userRouter;
