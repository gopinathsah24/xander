var express = require("express");
var router  = express.Router();
var Movie = require("../models/comment");
var middleware = require("../middleware/middleware");
var request = require("request");


router.get("/", function(req, res){
    Movie.find({}, function(err, movies){
        if(err){
            console.log(err);
        } else {
            request('https://maps.googleapis.com/maps/api/geocode/json?address=sardine%20lake%20ca&key=AIzaSyBtHyZ049G_pjzIXDKsJJB5zMohfN67llM', function(error,response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    res.render("comments/expert",{movie:movies});
                }
            });
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("comments/new");
});



router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.text;
    var newMovie = {text: name}
    Movie.create(newMovie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/comment");
        }
    });
});


module.exports = router;
