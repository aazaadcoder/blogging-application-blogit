const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
const Like = require("../models/like.model");

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
    return res.redirect(`/blog/view/${blog._id}`);
  } catch (error) {
    console.log(Error);
    return res.render("home", {
      error: "Server Error creating new blog. Try again.",
    });
  }
}

function getAllPublicBlogs(sortByField, sortByOrder) {
  return async (req, res) => {
    try {
      const sortBy = { [sortByField]: sortByOrder };
      // In JavaScript, square brackets ([]) in object keys are used for computed property names.

      // const allBlogs = await Blog.find({}).populate("createdBy");
      const allBlogs = await Blog.aggregate([
        {
          $sort: sortBy,
        },
        {
          $match : {isPublic : true}
        }
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
          },
        },
      ]);
      // console.log(allBlogs[0].title)

      res.render("home", {
        user: req.user,
        allBlogs,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.render("/", {
        error: "Error 500",
      });
    }
  };
}

function getAllPublicBlogsSortedByAField(sortByField) {
  return async (req, res) => {
    try {
      const sortedBlogData = await Blog.aggregate([
        {
          $lookup: {
            from: sortByField,
            foreignField: "blogId",
            localField: "_id",
            as: "indexCount",
          },
        },
        {
          $match : { isPublic : true}
        },
        {
          $addFields: {
            indexCount: { $size: "$indexCount" },
          },
        },
        {
          $sort: { indexCount: -1 },
        },     
        
      ]);

      console.log(sortedBlogData)
      return res.render("home", {
        user: req.user,
        allBlogs: sortedBlogData,
      });
    } catch (error) {
      console.log("Error in sort by likes: ", error);
      return res.render("home", {
        error: "Error 500",
      });
    }
  };
}
async function getBlog(req, res) {
  const blogId = req.params.blogId;

  try {
    //getting the blog data and author data and increment the view count
    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      {
        $inc: { viewCount: +1 },
      },
      { new: true }
    ).populate("createdBy");

    console.log(String(blog.createdBy._id));
    console.log(req.user?._id);
    if (blog.isPublic == false && String(blog.createdBy._id) != req.user?._id) {
      console.log("unathorized access to the a private article.");
      return res.redirect("/");
    }

    // if the blog with the requested blogId doesnot exists
    if (!blog) {
      console.log("blog doesnot exists");
      return res.redirect("/");
    }

    //fetching the count of the likes on the blog
    const likeData = await Like.find({ blogId });

    //fetching all comments of the blog
    const allBlogComments = await Comment.find({
      blogId: blog._id,
    }).populate("createdBy");

    return res.render("blog", {
      user: req.user,
      blog,
      likeData,
      allBlogComments,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
}

async function deleteBlog(req, res) {
  try {
    const blogId = req.params.blogId;
    if (!blogId) return res.send("blog id is required");

    const deletedBlog = await Blog.deleteOne({ _id: blogId });

    console.log("blog deleted");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
}

async function toggleBlogPrivacy(req, res) {
  const blogId = req.params.blogId;

  try {
    const blogData = await Blog.findOneAndUpdate(
      { _id: blogId },
      [
        {
          $set: {
            isPublic: { $not: "$isPublic" },
          },
        },
      ],
      { new: true }
    );

    console.log("blog updated successfully", blogData);
    return res.redirect(`/blog/view/${blogId}`);
  } catch (error) {
    console.log("Error in changing privacy status", error);
    return res.redirect(`/blog/view/${blogId}`);
  }
}
module.exports = {
  createNewBlog,
  getBlog,
  getAllPublicBlogs,
  deleteBlog,
  toggleBlogPrivacy,
  getAllPublicBlogsSortedByAField,
};
