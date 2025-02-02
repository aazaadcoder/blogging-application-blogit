const Like = require("../models/like.model");

async function toggleLike(req, res) {
  const blogId = req.params.blogId;
  const userId = req.user._id;
  if (!blogId) {
    console.log("blogId required to like the blog");
    return res.redirect("/");
  }

  try {
    //checking if user has liked this blog
    let likedData = await Like.findOne({ ownerId: userId });

    if (!likedData) {
      // if user has not liked the blog we will like it for him
      likeData = await Like.create({
        blogId,
        ownerId: userId,
        commentId: null,
      });
    }
    else{
        likedData = await Like.deleteOne({ownerId : userId})
    }

    console.log("liked toggle done");
    return res.redirect(`/blog/view/${blogId}`);
  } catch (error) {
    console.log("Error : ", error);
    return res.redirect(`/blog/view/${blogId}`);
  }
}

module.exports = {
  toggleLike,
};
