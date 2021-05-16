const mongoose = require('mongoose');
const Account = require('./Account');
const Schema = mongoose.Schema

var User = new mongoose.Schema({
   FullName:{
       type :String,
      
   },
   BirthDay:{
       type :String,
       
   },
   Address:{
       type :String,
   },
   Gender:{
       type:String,
   },
   PhoneNumber:{
       type:Number,
       ref:'Account'
   },
   AccountID:{
        type: Schema.Types.ObjectId,
      	ref: 'Account'
   },
   UserName:{
       type:String,
       ref:'Account'
   }
},{collection:'User',
   versionKey: false,
   timestamps:true
});

module.exports = mongoose.model('User',User)