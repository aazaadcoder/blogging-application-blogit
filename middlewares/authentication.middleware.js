const { verify } = require("jsonwebtoken");
const { validateToken } = require("../services/authentication.service");

function checkForAuthentication(cookieName) {
  return (req, res, next) => {
    const tokenValue = req.cookies[cookieName];
    req.user = null;
    try {
      const userPayload = validateToken(tokenValue);
      req.user = userPayload;
    } catch (error) {}
    next();
  };
}

function restrictToLogin(cookieName){
    return (req, res, next)=>{
        const token = req.cookies[cookieName];
        if(!token){
            console.log("Error: no token found.")
            return res.render("home", {
                error : "Unauthorized Access."
            });
        }

        try {
            const userPayload = validateToken(token);
            req.user = userPayload;
            next()
        } catch (error) {
            console.log(        error);
            return res.redirect("/");
        }
        
    }
}


module.exports = {
    checkForAuthentication,
    restrictToLogin,
}