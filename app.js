var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds"),
    Comment    = require("./models/comment");
var passport = require("passport");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var flash       = require("connect-flash");
//V10
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

mongoose.Promise = global.Promise;

//new
//user fetch karne ke liye

   
const databaseUri = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected!`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(flash());
//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",//secret used to decode encode the session
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//css/js ke liye
app.use(express.static(__dirname + "/public"));//dirname - directory name

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();//aage badiye :p
})

//---------------
//USE ROUTE FILES
//---------------
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Yelcamp Server has started"); 
});