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

function getAllBlogs(sortByField, sortByOrder) {
  return async (req, res)=>{
    try {
        const sortBy = { [sortByField ]: (sortByOrder)};
        console.log(sortBy)
        // In JavaScript, square brackets ([]) in object keys are used for computed property names.


        // const allBlogs = await Blog.find({}).populate("createdBy");
        const allBlogs = await Blog.aggregate(
            [
                {
                    $sort : sortBy,
                },
                {
                    $lookup:{
                        from : "users",
                        localField : "createdBy",
                        foreignField : "_id",
                        as : "createdBy"
                    }
                },
                
            ]
        )
        // console.log(allBlogs[0].title)

        res.render("home", {
          user: req.user,
          allBlogs,
        });
          } catch (error) {
        console.log("Error: ", error);
        return res.render('/',{
            error : "Error 500"
        })
      }
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
  getAllBlogs
};
