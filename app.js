const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const Campground = require("./models/campground");
const seedDB = require("./seeds");
const Comment = require("./models/comment");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const passportLocalMongoose = require("passport-local-mongoose");

const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://tonysui:tonysui@cluster0-xrhrm.mongodb.net/yelp_camp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash()); 




// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hanbao",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// seedDB();

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
 











app.listen(3000, function(){
    console.log("Server has started")
})