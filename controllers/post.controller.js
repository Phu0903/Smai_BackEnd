
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
          const findInfoAuthor = await User.findById({'_id':IDAuthor})
          if(!findInfoAuthor){
              return res
                     .status(400)
                     .json({
                         success:false,
                         message:'User is not exist'
                     })
          }
          else {
           
              const dataPost = new Post({
                  'IDAuthor':ID_user,
                  'ProductID':ProductID,
                  'TitlePost':TitlePost,
                  'NotePost':NotePost,
                  'TypeAuthor':TypeAuthor ||'Cá nhân',
                  'Address':Address ||findInfoAuthor.Address,
                  'NameAuthor':NameAuthor ||findInfoAuthor.FullName,


              })
          }
        

          
      } catch (error) {
          
      }

    }
}