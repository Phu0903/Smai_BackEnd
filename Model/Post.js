const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new mongoose.Schema({
    AuthorID:{
        type: Schema.Types.ObjectId,
        ref: 'User'
   },

   TypeAuthor:{
    type :String,
    require:true,
    enum:['Cá nhân','Quỹ/Nhóm từ thiện','Tổ chức công ích "Chính quyền nhà thờ, nhà chùa,..."']
   
  },
  NameAuthor:{
     required:true,
     type:String,
    
  },
  address:{
       required:true,
       type:String,
       
      
  },
   
  NameProduct:{
    required:true,
    type:String,
   },
   ProductID:{
        required:true,
        type:String,
   },
  
   title: {
    type: String,
    required: true
    },
   note:{
       type:String,
       
   },
   expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 400 }, // giới hạn thời gian 400s
  },
   
},{collection:'Post',
  timestamps:true,
  versionKey: false,
})
module.exports =mongoose.model('Post',Post)
