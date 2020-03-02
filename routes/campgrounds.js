const express = require("express");
const router = express.Router();
const Campground = require("../models/campground")
const middleware = require("../middleware")

// INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds})
        }  
    })
})

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    const newCampground = {
        name: req.body.name, 
        image: req.body.image, 
        description: req.body.description,
        price: req.body.price,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    Campground.create(newCampground, function(err, doc){ 
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        } 
    })
})

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

// SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        } 
    }); 
})

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    })
})
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground , function(err, updatedCampground){
        res.redirect("/campgrounds/" + req.params.id)
    })
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/campgrounds");
    })
})







module.exports = router;