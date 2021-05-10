var mongoose = require('mongoose');
var users = new mongoose.Schema({
    AccountID:mongoose.Schema.Types.ObjectId,
    UserName:{
        type:String,
        require:true,
        unique:true //Duy nhất
    },
    Password:
    {
        type:String,
        require:true, //yêu cầu
       
    },
    CreateDay:
    {
        type:Date,
        default:Date.Now
    }
    

},{collection:'User'});

module.exports = mongoose.model('User',users)