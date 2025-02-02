const { verify } = require("jsonwebtoken");
const { validateToken } = require("../services/authentication.service");
const Blog = require("../models/blog.model");
const { default: mongoose } = require("mongoose");

function checkForAuthentication(cookieName) {
  return (req, res, next) => {
    const tokenValue = req.cookies[cookieName];
    req.user = null;
    try {
      const userPayload = validateToken(tokenValue);
      req.user = userPayload;
    } catch (error) {}
    next();
  };
}

function restrictToLogin(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (!token) {
      console.log("Error: no token found.");
      return res.render("home", {
        error: "Unauthorized Access.",
      });
    }

    try {
      const userPayload = validateToken(token);
      req.user = userPayload;
      next();
    } catch (error) {
      console.log(error);
      return res.redirect("/");
    }
  };
}

function restrictToOwner(cookieName) {
  return async (req, res, next) => {
    try {
      //   accessing the token and blogId from the req
      const token = req.cookies[cookieName];
      const blogId = req.params.blogId;

      //   if token doesnot exists redirect to the blog page
      if (!token) return res.redirect(`/blog/${blogId}`);

      //   validate the token jwt
      const loginUser = validateToken(token);

      //
      if (!loginUser) return res.redirect(`/blog/${blogId}`);

      const blogData = await Blog.findOne({ _id: blogId });
      if (!blogData) return res.redirect(`/blog/${blogId}`);

      if (
        loginUser._id === String(blogData?.createdBy) ||
        loginUser.role == "admin"
      ) {
        return next();
      }

      console.log("unathorized access in restrict to owner.");
      return res.redirect("/");
    } catch (error) {
      console.log("error in retricittologin", error);
      return res.redirect(`/blog/${blogId}`);
    }
  };
}

module.exports = {
  checkForAuthentication,
  restrictToLogin,
  restrictToOwner,
};
