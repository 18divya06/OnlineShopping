const jwt = require("jsonwebtoken");
const user= require("../models/users")
exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  //console.log('req body:', req.body);
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_Key, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

exports.isAdminToken = (req, res, next) =>{
  console.log("middle2"+ req.body.userId);
  if(req.body.userId){
      user.findById(req.body.userId).exec((err, user) => {
        if (err) {
         return res.status(500).send({ message: err });
         
        }else if(user.isadmin){
          next();
        }else{
          return res.status(403).send();
        }
  });
}
};