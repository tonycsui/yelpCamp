const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");




// Root Route
router.get("/", function(req, res){
    res.render("landing")
})





// AUTH ROUTES

// Show register form
router.get("/register", function(req, res){
    res.render("register");
})

// Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, " + user.username);
            res.redirect("/campgrounds");
        })
    })
})

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
})

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/campgrounds");
})


module.exports = router;