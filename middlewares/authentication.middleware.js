const { verify } = require("jsonwebtoken");
const { validateToken } = require("../services/authentication.service");
const Blog = require("../models/blog.model");

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
      const token = req.cookies[cookieName];
      const blogId  = req.params.blogId;
      console.log(blogId)

      if (!token) return res.redirect(`/blog/${blogId}`);

      const loginUser = validateToken(token);

      if (!loginUser) return res.redirect(`/blog/${blogId}`);

      const blogData = await Blog.findOne({ _id: blogId });
      if (!blogData) return res.redirect(`/blog/${blogId}`);

      if (loginUser._id != blogData?.createdBy || loginUser.role == "admin") next();
        return res.render("home", {
            error: "Unathorized access",
          });

      
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
