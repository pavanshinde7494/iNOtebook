const jwt = require("jsonwebtoken");

const fetchUser = ( req , res , next)=>{
    // Get the user from jwt token and id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error : "Please Authenticate using a valid token"});
    }


    try {
        const data = jwt.verify(token , 'secret');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error : "Invalid Token"});
    }
    
}

module.exports = fetchUser;
