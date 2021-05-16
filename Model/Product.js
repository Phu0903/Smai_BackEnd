const mongoose = require('mongoose');
const Product = new mongoose.Schema({
    NameProduct:{
        type: Schema.Types.ObjectId,
      	ref: 'Account'
   },
   Category:{
        type:String,
   }
},{collection:'Product'});
module.exports =mongoose.model('Product',Product)