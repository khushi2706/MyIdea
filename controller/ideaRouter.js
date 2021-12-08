const express = require("express");
const ideas = require("../model/idea");
const moment = require("moment");
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

function checkAuth(req,res, next){
    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        res.redirect("/login");
    }
}

router.get("/", checkAuth,(req,res) =>{
    ideas.find({email : req.user.email} , (err,data) =>{
        if(err) throw err;
        if(data)
        {
            res.render("myidea",{csrfToken :req.csrfToken() , data :data , moment : moment});
        }
    })
})

router.get("/delete/:id", checkAuth,(req,res) =>{

    var myId = req.params.id;
    console.log(myId);
    console.log(typeof myId);

    ideas.deleteOne({"_id" : ObjectId(myId) }, (err,data) =>{
        if(err) throw err;
        res.redirect("/myidea");
    })
})

router.post('/add', checkAuth , (req,res) =>
{
    const {title , desc } = req.body;

    console.log(title , desc);
    ideas({
        email: req.user.email,
        title :title,
        desc :desc,
    }).save();
    res.redirect("/myidea");
});

module.exports = router;
