//all meddleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found.")
            res.redirect("back");
        } else {
            //does user own the cg
            if(foundCampground.author.id.equals(req.user._id)){//'===' kaam nahi dega kyuki 'author.id' object he or '_id' string he
               next();
            } else {
                req.flash("error","You don't have permission to do that. ");
                res.redirect("back");
            }
        }
    });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error","Comment not found.");
            res.redirect("back");
        } else {
            //does user own the comment
            if(foundComment.author.id.equals(req.user._id)){//'===' kaam nahi dega kyuki 'author.id' object he or '_id' string he
               next();
            } else {
                req.flash("error","You don't have permission to do that. ");

                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("/login");
    }
}


module.exports = middlewareObj;
    
