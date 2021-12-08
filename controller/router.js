const express = require("express");
const router = express.Router();
const users = require("../model/data");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require('./passportlocal')(passport);
router.get('/', (req, res)=>{
    res.render('index');
});

router.get('/signup' , (req,res)=>{
    res.render('signup',  {csrfToken :req.csrfToken()});
});


router.get('/login', (req,res)=>{
    res.render("login", {csrfToken :req.csrfToken() });
});


router.post('/signup' , async (req,res)=>{

    const { name , email , password , rePass } = req.body;

    if(!name || !email || !password || !rePass )
    {
        res.render("signup", {csrfToken :req.csrfToken() , err:"All field are requied!!" });
    }
    else if( password != rePass )
    {
        res.render("signup", {csrfToken :req.csrfToken() ,
                    err:"Both password should same.." });
    }
    else{
       var userData = await users.findOne({email : email});
        if(userData)
        {
            res.render("signup" ,  {csrfToken :req.csrfToken() ,
                err:"User are already exist" });
        }
        else{
            var salt = await bcrypt.genSalt(12);
            var hash = await bcrypt.hash(password , salt);

            users({                
                username : name,
                email : email,
                password : hash,
            }).save();

            res.redirect("/login");
        }
    }
});

router.post('/login' , async (req,res,next)=>{

    const {email , password  } = req.body;

    if(!email || !password)
    {
        res.render("login", {csrfToken :req.csrfToken() , err:"All field are requied!!" });
    }
    else{
      
        passport.authenticate("local", {
            failureRedirect: "/login",
            successRedirect: "/myidea",
            successFlash: true,
        })(req,res,next);
     
    }
});

router.get('/logout', (req,res)=>{
    req.logOut();
    req.session.destroy((err) =>{
        res.redirect("/");
    });
});


//idea router

router.use("/myidea", require("./ideaRouter"));

module.exports = router;