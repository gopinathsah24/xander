var Comment = require("../models/comment");
var Movie = require("../models/movie");


module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    
    
    anotherLogIn: function(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You Have To Log Out From Current Account");
        res.redirect("/movies");
    },


    checkUserMovie: function(req, res, next){
        if(req.isAuthenticated()){
            Movie.findById(req.params.id, function(err, movie){
                if(movie.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    console.log("BADD!!!");
                    res.redirect("/movies/" + req.params.id);
                }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },


    checkUserComment: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/movies/" + req.params.id);
                }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    }
}