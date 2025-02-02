const JWT = require("jsonwebtoken");

const secretKey = "dafafaaasddfdsfaf";


function createTokenForUser(user){

    const payload= {
        fullName : user.fullName,
        email : user.email, 
        profileImageUrl : user.profileImage,
        _id : user._id,
        role : user.role
    }

    const token = JWT.sign(payload, secretKey);

    return token;


}

function validateToken(token){
    const payload = JWT.verify(token, secretKey)
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}