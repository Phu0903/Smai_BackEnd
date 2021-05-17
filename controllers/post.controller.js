
const Post = require('../Model/Post');

const User =require('../Model/User')
module.exports = {
    
    //Add post from User
    AddPost: async(req,res)=>{
        const {
            ID_user,
            TitlePost,
            NotePost,
            ProductID,
            NameProduct,
            TypeAuthor,
            NameAuthor,
            Address
        } = req.body;
      try {
          if(!ID_user || !TitlePost || !NameProduct )
          {
              return res
              .status(400)
              .json({
                  success:false,
                  message:'ID_user is not exist'
              })


          }
          const findInfoAuthor = await User.findOne({'_id':ID_user})
         
      
          if(!findInfoAuthor){
              return res
                     .status(400)
                     .json({
                         success:false,
                         message:'No have ID'
                     })
          }
          else {
           
              const dataPost = new Post({
                  'AuthorID':ID_user,
                  'address':Address || findInfoAuthor.Address,
                  'NameAuthor':NameAuthor ||findInfoAuthor.FullName,
                  'TypeAuthor':TypeAuthor ||'Cá nhân',
                  'ProductID':ProductID,
                  'NameProduct':NameProduct,
                  'title':TitlePost,
                  'note':NotePost,
                  
                 
                  

              })
              
          
             dataPost.save(function (err){
                  res.status(201)
                      .json({
                          success:true,
                          message:"Oke"
                      })
              })
             
              
          }
        

          
      } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
      }

    },


    //Get Info Post
    GetInfoPost: async(req,res)=>{
         try {
           const post= await Post.find({})
           if(!post)
           {
               return res
                      .status(400)
                      .json({
                          success:false,
                          message:'post is not exist'
                      })
           }
           else{
              return res
                     .status(201)
                     .json(post)   
           }
         } catch (error) {
            res.status(500).json({
                success: false,
                message: err.message
              });
            }
         
    }

}