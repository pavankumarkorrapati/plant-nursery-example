var express = require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy= require("passport-local");
var User = require("./models/user");
methodOverride=require("method-override");
var partials=require("express-partials");
const { render } = require("ejs");
flash=require("connect-flash");
//customer-reviews-content id


mongoose.connect("mongodb://localhost/ecommerce",{ useNewUrlParser: true,useUnifiedTopology: true });



app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" , "ejs");  
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));
app.use(flash());

app.use(partials());


app.use(require("express-session")({
    secret: "I don't know",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req,res,next){
    res.locals.currentUser =req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


    app.get("/", function(req,res){
                
                res.render("index"); 
       
    });

    

    async function aaa(){
        
    }



    app.get("/launch", isLoggedIn,function(req,res){
        res.render("launch");
    });





//login signup

app.get("/register", function(req,res){
    
    res.render("signup");
});

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
           // req.flash("error", err.message);
           console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success","Welcome to Plant-nursery");
            res.redirect("/");
        })
    })
});


app.get("/login", function(req,res){
    res.render("signin");
});

app.post("/login", passport.authenticate("local",
{
    successRedirect:"/",  
    failureRedirect:"/login"
}),function(req,res){
 
});

app.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});


// comment 


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


app.get("/search", function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        

        Ecommerce.find({$or:[{name:regex},{author: regex}]}, function(err,foundBook){
            if(err)
                console.log(err);
            else{
                
                res.render("index" , {ecommerce:foundBook}); 
               
            }
        })
    }

});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//IsAdmin authentication
function checkAdmin(req,res,next){
    if(req.isAuthenticated()){
        if(res.locals.currentUser.role===1){
            next();
        }
        else{
            req.flash("error","You need to be logged in to do that");
            res.redirect("/");
        }

    }
    else{
        res.redirect("back");
    }

};


app.listen(2609,function(){
    console.log("Choose and Track at 2609");
});

 