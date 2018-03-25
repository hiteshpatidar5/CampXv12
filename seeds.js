var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Granite Hill",
        image: "https://i.pinimg.com/originals/23/91/46/23914616673d4e4c2efcbecf5a02bf54.jpg",
        description: "Lorem ipsum dolor sit amet, id epicuri definiebas cum, ne iisque dolores has, pro no detracto constituam. Viris possit eu sit, ei graece erroribus hendrerit nam, mucius eirmod sed an. Consul complectitur usu ei, quo ea labore suscipit, qui doctus dissentias no. Duo ut soluta diceret, no erat verear mea. Sed patrioque interesset sadipscing ad, qui amet equidem instructior id"
    },
    {
        name: "Clouds Rest",
        image: "http://www.acadiamagic.com/280x187/md-campground.jpg",
        description: "not so good"
    },
    {
        name: "Canyon Floor",
        image: "http://www.makeyourdayhere.com/ImageRepository/Document?documentID=51",
        description: "majedaar"   
    }];

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campground");
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added new cg");
                    //add sme comments
                    Comment.create({
                        text:"no internet",
                        author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");    
                        }
                        
                    });
                }
        });
    });
     });
    
    
    
}

module.exports = seedDB;