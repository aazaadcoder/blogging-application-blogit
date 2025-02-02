const {Schema , model} = require('mongoose');
 

const likeSchema = Schema({

    commentId: {
        type : Schema.Types.ObjectId,
        ref : "comments",
    },
    blogId : {
        type : Schema.Types.ObjectId,
        ref : "blogs",
    },
    ownerId :{
        type : Schema.Types.ObjectId,
        ref : "users",
        required: true
    }

})

const Like = model("like", likeSchema);

module.exports =  Like;