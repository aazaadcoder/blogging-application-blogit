const Comment = require("../models/comment.model");

 
async function createCommentOnBlog(req, res){
    const blogId = req.params.blogId;

    if(!blogId){
        console.log("blogId required.")
        return res.redirect("/")
    }

    const commentContent = req.body.commentContent;
    if(!commentContent) {
        console.log("comment field required.")
        return res.redirect(`/blog/view/${blogId}`)
    }


    try {
        const commentData = await Comment.create({
            content : commentContent, 
            createdBy : req.user._id,
            blogId ,
        })
        return res.redirect(`/blog/view/${blogId}`)


    } catch (error) {
        console.log("Server Error in commenting: ", error);
        return res.redirect(`/blog/view/${blogId}`)

    }


}



module.exports = {
    createCommentOnBlog
}