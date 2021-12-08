const mongo = require("mongoose");

const userSchema = new mongo.Schema({
    username : {
        type: String,
        required:true,
    },
    email : {
        type: String,
        required:true,
    },
    password : {
        type: String,
        required:true,
    },
    created: {
        type:Date,
        required:true,
        default: () => Date.now()
    }
});

module.exports = mongo.model('user' , userSchema)
