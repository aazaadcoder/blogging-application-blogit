    const {Schema , model, trusted} = require('mongoose');


const commentSchema = Schema({
    content :{
        type : String,
        required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        required : true,
        ref: "user"
    },
    blogId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref : "blog"
    }
})

const Comment = model("comment", commentSchema)

module.exports = Comment;
