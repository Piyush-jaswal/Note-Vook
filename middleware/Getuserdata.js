//Get login details of user
var jwt = require('jsonwebtoken');
const JWT_SECRET_STRING = "KingisPiyush,PiyushisKing";
const fetchuser = (req,res,next) =>
{
    var token =  req.header('auth-token');
    if(!token)
    {
        res.status(400).send("Acess Denied");
    }
    else{
        // Conerts token into id 
        try {
            const details = jwt.verify(token,JWT_SECRET_STRING);
            req.user = details.user;
            next();
        } catch (error) {
            res.json({"error": error});
        }
        
    }
}
module.exports = fetchuser;