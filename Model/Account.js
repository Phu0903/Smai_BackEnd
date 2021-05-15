var mongoose = require('mongoose');
var Account = new mongoose.Schema({
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
    PhoneNumber:
    {
        type:Number,
        require:true,
    },
    CreateDay:
    {
        type:Date,
        default:Date.Now
    }
    

},{collection:'Account'});

module.exports = mongoose.model('Account',Account)