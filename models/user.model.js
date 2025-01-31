const {Schema , model} = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication.service');

const userSchema = new Schema({
    fullName :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true, 
        unique : true,
    },
    profileImage : {
        type : String, 
        default : "/images/defaultUserProfileImage.png"
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        required : true, 
    },
    role : {
        type : String, 
        enum : ["user" , "admin"],
        default : "user",
    }
}, {timestamps : true})

userSchema.pre("save" , function(next){
    const user = this ; 

    if(!user.isModified("password")) next();

    const salt = randomBytes(16).toString(); // it is the secret 
    
    const hashedPassword  = createHmac("sha256", salt ).update(user.password).digest("hex")

    this.salt = salt ; 
    this.password = hashedPassword; 

    next();

})

//virtual function in mongoose

userSchema.statics.matchPasswordAndGenerateToken =  async function(email , password){
    const userData = await User.findOne({email});

    if(!userData) throw new Error("User Not Found.");

    const userEnteredHashedPassword = createHmac("sha256", userData.salt ).update(password).digest("hex");

    if(userEnteredHashedPassword != userData.password) throw new Error("Wrong Password.")
    const token = createTokenForUser(userData);
    return token;
}

const User = model("user", userSchema);


module.exports = User;
