var express = require("express");
var router  = express.Router();
var Movie = require("../models/movie");
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
                    res.render("movies/movies",{movie:movies});
                }
            });
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("movies/new");
});



router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var add = req.body.address;
    var aut = req.body.auth_id;
    var newMovie = {name: name, image: image, description: desc, author:author,address:add,auth_id:aut}
    Movie.create(newMovie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/");
        }
    });
});


module.exports = router;
