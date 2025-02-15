const {Schema , model} = require('mongoose');


const blogSchema = new Schema({
    title : {
        type: String,
        required : true 
    },
    body : {
        type: String,
        required : true 
    },
    viewCount:{
        type: Number,
        default : 0 
    },
    coverImage : {
        type: String, 
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    isPublic:{
        type: Boolean,
        default : true,
    }
}, {timestamps  : true })

const Blog = model("blog", blogSchema);


module.exports = Blog ; 