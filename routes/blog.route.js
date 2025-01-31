const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { createNewBlog, getBlog, getAllBlogs } = require("../controllers/blog.controller");
const { restrictToLogin } = require("../middlewares/authentication.middleware");
const Blog = require("../models/blog.model");
const { get } = require("http");
const { createCommentOnBlog } = require("../controllers/comment.controller");
const blogRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

blogRouter.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

blogRouter.post("/",
  restrictToLogin("token"),
  upload.single("coverImage"),
  createNewBlog
);


blogRouter.get("/:blogId", getBlog);

blogRouter.post("/comment", restrictToLogin("token"), createCommentOnBlog);

blogRouter.get("/sort/latest", getAllBlogs("createdAt", -1));
blogRouter.get("/sort/oldest", getAllBlogs("createdAt", +1));

module.exports = blogRouter;
