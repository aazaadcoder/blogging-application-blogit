const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
 
async function createNewBlog(req, res) {
  // console.log(req.file);
  if (!req.body.title || !req.body.body || !req.file || !req.file.filename) {
    return res.render("addBlog", {
      error: "all fields are required.",
    });
  }
  try {
    // console.log()
    const blog = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      coverImage: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });
    // return res.render('home', {
    //     successMessage : "Blog created successfully."
    // })
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.log(Error);
    return res.render("home", {
      error: "Server Error creating new blog. Try again.",
    });
  }
}

async function getBlog(req, res) {
  const blogId = req.params.blogId;

  try {
    const blog = await Blog.findById(blogId).populate("createdBy");
    //using populate we will get all the details of the user

    const allBlogComments = await Comment.find({
      blogId: blog._id,
    }).populate("createdBy");


    if (!blog) {
      console.log("blog doesnot exists");
      return res.redirect(req.headers.referer);
    }

    return res.render("blog", {
      user: req.user,
      blog,
      author: blog.createdBy?.fullName,
      allBlogComments,
    });
  } catch (error) {
    console.log(error);
    return res.redirect(req.headers.referer);

    
  }
}

module.exports = {
  createNewBlog,
  getBlog,
};
