const Comment = require("../models/comment.model");

 
async function createCommentOnBlog(req, res){
    commentContent = req.body.commentContent;
    if(!commentContent) {
        console.log("comment field required.")
        return res.redirect(req.header.referer,{
            error : ""
        });
    }
    // console.log(req.headers.referer)

    const blogId  = req.headers.referer.split("http://localhost:8000/blog/").join("");


    try {
        const commentData = await Comment.create({
            content : commentContent, 
            createdBy : req.user._id,
            blogId ,
        })

    } catch (error) {
        console.log(Error);
        // req.flash("Error", "Error in commenting.")
    }
    return res.redirect(req.headers.referer)

}



module.exports = {
    createCommentOnBlog
}