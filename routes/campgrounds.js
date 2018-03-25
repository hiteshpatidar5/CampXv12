var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");//index.js likhne ki jaroorat ni


router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allcampgrounds, page: 'campgrounds'});
        }
    })
    
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campground array
    var name = req.body.name;
    var image= req.body.image;
    var price= req.body.price;
    var desc= req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, image:image,price:price, description: desc, author:author};
    
    //v9 me naya
    
    /*campgrounds.push(newCampground);*/
    //create a new camground and save to db
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
            
        } else {
            
             //redirect to campgrounds page
             res.redirect("/campgrounds");
        }
    })
   
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(req, res) {
    
    res.render("campgrounds/new");
});

//SHOW - shows more info abt one campground
router.get("/campgrounds/:id", function(req, res){
   //find the campground with provided id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err || !foundCampground){
          req.flash("error", "Campground not found");
          res.redirect("back");
      } else {
          console.log(foundCampground);
          //render show twmplate with that campground
          res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user});
      }
   });
   
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    //is user logged in
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
            
    });
    
        
    //if not redirect
    
    
    
})

//UPDATE ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
   //find and update correct campG
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
    
})



module.exports = router;