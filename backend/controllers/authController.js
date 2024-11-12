const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/user-model");


module.exports.registeredUser = async function (req, res) {
    try {
        let { fullname, email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) return res.status(401).send("You already have an account. Please Login");

        bcrypt.genSalt(10, function (error, salt) {
            bcrypt.hash(password, salt, async function (error, hash) {
                if (error) return res.send(error.message);
                else {
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                    });

                    let token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_KEY);

                    res.cookie("token", token);
                    res.send("User created successfully"); 
                
                }
            });
        });

    } catch (error) {
        res.send(error.message);
    }
};



module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });

    if (!user) return res.send("Email or Password Incorrect");

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_KEY);

            res.cookie("token", token);
            res.send("You can log in");
            
        } else {
            return res.send("Email or Password Incorrect");
        }
    });
};



module.exports.logout = async function (req, res) {
    if (req.cookies.token) {
        res.clearCookie("token");
        res.send("User Logged Out");
    } else {
        res.send("No one is logged in");
    }
};
