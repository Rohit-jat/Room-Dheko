const express = require('express');
const router = express.Router();
const User = require("../models/users");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/users");



router.route("/signup")
.get((req , res )=>{
    res.render("users/signup.ejs")
})
.post((userController.userSignup)
);


router.route("/login")
.get( (req , res )=>{
    res.render("users/login.ejs");
})
.post( saveRedirectUrl,
    passport.authenticate('local',
     { failureRedirect: '/login' , failureFlash : true}),
        userController.UserLogin
    );



router.get("/logout",(userController.userLogout));

module.exports = router;    