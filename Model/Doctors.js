const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Doctors = new mongoose.Schema({
  NameDoctor: {
    type: String,
    require: true,
  },
  TimeWork:[],
  Department:{
     type:String,
  },
  PhoneNumber:{
     type:String
  }
},{
   collection:'Doctors',
   timestamps:true,
   versionKey: false,

});
module.exports = mongoose.model("Doctors", Doctors);