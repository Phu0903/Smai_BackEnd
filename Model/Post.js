const mongoose = require('mongoose');
const Post = new mongoose.Schema({
    AccountID:{
        type: Schema.Types.ObjectId,
      	ref: 'Account'
   },
   ProductID:{
        type:Schema.Types.ObjectId,
   },
   CreateDay:{
    type:Date,
    default:Date.Now
   },
   TypeAuthor:{
     type :String,
     require:true,
     enum:['Cá nhân','Quỹ/Nhóm từ thiện','Tổ chức công ích "Chính quyền nhà thờ, nhà chùa,..."']
    
   },
   NameAuthor:{
      Type:String,
      require:true,
   },
   Address:{
        Type:String,
        require:true,
   },
   TitlePost:{
       Type:String,
       require:true
   },
   NotePost:{
       Type:String,
       
   },
   IDAuthor:{
    type: Schema.Types.ObjectId,
    ref: 'User'
   }
},{collection:'Post',
  timestamps:true,
  versionKey: false
});
module.exports =mongoose.model('Post',Account)
