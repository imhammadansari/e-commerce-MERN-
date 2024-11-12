const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {

    console.log(req.cookies.token); 

    if (!req.cookies.token) {
        return res.status(401).send("You need to login first");
    } else {
        try {

            const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
            console.log(decoded);


            const user = await userModel.findOne({ email: decoded.email }).select("-password");
            console.log(user); 

            if (!user) {
                return res.status(401).send("User not found");
            }

            req.user = user; 
            next(); 
        } catch (error) {
            console.error(error); 
            return res.status(401).send("Invalid token");
        }
    }
};
