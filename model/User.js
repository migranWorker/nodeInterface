const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    userNum:{
        type:Number
    },
    userName:{
        type:String
    },
    userPsd:{
        type:String
    }
})

module.exports = user = mongoose.model('user',userSchema);