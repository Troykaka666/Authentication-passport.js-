var express = require("express"),
    app = express(),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true });
    
app.set('view engine', 'ejs');


//This code is required whenever we want to retrive date from a post
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "My cats are the cutest animal in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//====================
// ROUTES
//===================

app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//Auth Route
app.get("/register", function(req, res) {
   res.render("register"); 
});
app.post("/register", function(req, res){
    //1. create a user first by passing the username
    //2. Adding a new use by using register to the mongoose DB
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/secret");
       });
   });
});

//LOGIN ROUTES
//rederlogin form
app.get("/login", function(req, res) {
    res.render("login");
});
//login logic: middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    
});


//Logout routes
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server starting.....");
});