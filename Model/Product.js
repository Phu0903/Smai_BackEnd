const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = new mongoose.Schema({
   
   
   NameProduct:{
      type:String,
  
   },
   Category:{
        type:String,
   }
},{collection:'Product'});
module.exports =mongoose.model('Product',Product)