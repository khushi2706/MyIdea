const users = require('../model/data');
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = (passport) => {

    passport.use(
    new localStrategy({ usernameField: 'email' }, 
    (email, password , done)=>{
        users.findOne({ email : email } , (err,data) =>{
            if (err) throw err;
            if(!data)
            {
                return done(null,false, {message : "user doesn't exist!"});
            }
            else
            {
                bcrypt.compare(password, data.password , (err,match) =>{
                    if (err) throw err;
                    if(match)
                    {
                        return done(null,data);
                    }
                    else
                    {
                        return done(null,false, {message: "Password error!!"});
                    }

                })
            }
        })
    })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        users.findById(id, function(err, user) {
          done(err, user);
        });
      })

};