const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { createNewBlog, getBlog,   deleteBlog, toggleBlogPrivacy, getAllPublicBlogs, getAllPublicBlogsSortedByAField } = require("../controllers/blog.controller");
const { restrictToLogin, restrictToOwner } = require("../middlewares/authentication.middleware");
const Blog = require("../models/blog.model");
const { get } = require("http");
const { createCommentOnBlog } = require("../controllers/comment.controller");
const { likeBlog, toggleLike } = require("../controllers/like.controller");
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


blogRouter.get("/view/:blogId", getBlog);
blogRouter.post("/delete/:blogId", restrictToOwner("token"), deleteBlog );

blogRouter.post("/like/:blogId", restrictToLogin("token"), toggleLike );



// a user can delete his article 



blogRouter.post("/comment/:blogId", restrictToLogin("token"), createCommentOnBlog);

blogRouter.get("/sort/latest", getAllPublicBlogs("createdAt", -1));
blogRouter.get("/sort/oldest", getAllPublicBlogs("createdAt", +1));
blogRouter.get("/sort/viewcount", getAllPublicBlogs("viewCount", -1));
blogRouter.get("/sort/commentcount", getAllPublicBlogsSortedByAField("comments"));
blogRouter.get("/sort/likecount", getAllPublicBlogsSortedByAField("likes"));

blogRouter.post("/edit-privacy/:blogId", restrictToOwner("token"), toggleBlogPrivacy)
// blogRouter.post("/editcontent/:blogId", restrictToOwner("token"), toggleBlogPrivacy)
blogRouter.post("/edit-content/:blogId", (req, res)=>{
  const blogId = req.params.blogId;

  if(!blogId){
    console.log("blogId required");
    return res.redirect("/");
  }
  console.log(req);
  req.blogId = blogId;
  return res.render("editBlogContent")
})

module.exports = blogRouter;
