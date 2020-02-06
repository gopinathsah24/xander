var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/middleware");


router.get("/", function(req, res){
    res.render("home");
});


router.get("/signup",middleware.anotherLogIn,function(req, res){
   res.render("signup");
});


router.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/");
        });
    });
});


router.get("/login",middleware.anotherLogIn, function(req, res){
   res.render("login");
});


router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash:true,
        successFlash:"Welcome To Cineries"
    }), function(req, res){;
});


router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/");
});


module.exports = router;
