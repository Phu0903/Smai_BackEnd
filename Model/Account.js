const mongoose = require('mongoose');
const Account = new mongoose.Schema({
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
  
    

},{collection:'Account',
   timestamps:true,
});

module.exports = mongoose.model('Account',Account)