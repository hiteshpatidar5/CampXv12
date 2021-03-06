var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");//index.js likhne ki jaroorat ni


// COMMENT ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
 //pichhle wala new alag tha , iskae liye alag directory he 
   //find campground byu id
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
   });
    
});
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new coment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
           
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment.")
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
            //connect new comment to campground
            //redirect campground show page
        }
    })
})


//EDIT comment route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });//ye id campground ki he(comment ki ni)        
        }
    })
    
})
//comments update
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
       Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
})

//DESTROY Comment ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success","Comment deleted.");

            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

//MIDLEWARE

module.exports = router;