const express = require("express");
const router = express.Router();
const { registeredUser, loginUser, logout } = require("../controllers/authController")


router.get("/", function (req, res) {
    res.send("Hey, Its working");
})

router.post("/register", registeredUser)

router.post("/login", loginUser);

router.get("/logout", logout);



module.exports = router;