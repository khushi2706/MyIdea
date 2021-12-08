const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const csruf = require("csurf");
//static file
app.use('/static',express.static(__dirname+"/static"))
app.use(express.urlencoded({ extended : true}))

//template engine 
app.set("view engine","ejs");
app.set("views",__dirname+"/views");

//authantication

app.use(cookieParser("randomKey"));
app.use(
    expressSession({
        secret: "randomKey",
        resave: true,
        saveUninitialized: true,
        maxAge : 24 * 60 * 60 *1000,
    })
)

app.use(csruf());

//login

const passport = require("passport");
const flash = require("connect-flash");
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next)=>{
    res.locals.error = req.flash('error');
    next();
});

//router setup
const router = require("./controller/router.js")
app.use(router);



//database
const mongoURL = require("./config/mongoKey");
const mongoose = require("mongoose");
const data = require("./model/data")

// connecct db
mongoose.connect(mongoURL ,
     {  useNewUrlParser: true,
        useUnifiedTopology: true,
        }).then(() => console.log("Database connected!"))
        .catch(err => console.log(err));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Started At ${PORT}`));