const { use } = require("react");
const User = require("../models/user.model");
const { createHmac, randomBytes } = require("crypto");

async function userSignUp(req, res) {
  const { fullName, email, password } = req.body;
  const newUserData = await User.create({
    fullName,
    email,
    password,
  });

  return res.render("signin");
}

async function userSignIn(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin",{
        error : "Incorrect Email Or Password."
    })
  }
}

function userLogOut(req, res){
    return res.clearCookie("token").redirect("/");
}
module.exports = {
  userSignUp,
  userSignIn,
  userLogOut
};
