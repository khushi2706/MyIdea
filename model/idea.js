const mongo = require("mongoose");

const ideaSchema = new mongo.Schema({
    email : {
        type: String,
        required:true,
    },
    title: {
        type: String,
        required:true,
    },
    desc : {
        type: String,
        required:true,
    },
    created: {
        type:Date,
        required:true,
        default: () => Date.now()
    }
});

module.exports = mongo.model('idea' , ideaSchema)