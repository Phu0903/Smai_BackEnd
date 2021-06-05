const mongoose = require('mongoose');
const verifyToken = require('../middleware/auth')
const Post = require('../Model/Post');
const Schema = mongoose.Schema;
const Product = require('../Model/Product')
const User = require('../Model/User')
const multer  = require('multer');
const { json } = require('express');
var ObjectID = require('mongodb').ObjectID;



module.exports = {
    //Test Token
    TestToke:async(req,res)=>{
      try {
        res.json({

            'message':req.accountID,
        }) 
      } 
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
      
    },
    //Test image
    TestImage: async(req,res)=> {
        console.log(req.files);
        try {
            res.status(200).json({
                success:true,
                'message':"OKE"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },



    //Add post from User
    AddPost: async (req, res) => {
        console.log(req.accountID);
        console.log(req.files);
        const {
            title,
            note,
            NameProduct,
            TypeAuthor,
            NameAuthor,
            address,
        } = req.body;
        console.log(title);
        console.log(note);
        console.log(NameProduct);
        console.log(TypeAuthor);
        console.log(address);

        try {

            if (!title) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        'message': 'Title is not exist'
                    })
            }
            const findInfoAuthor = await User.findOne(
                { 'AccountID': req.accountID }
            )
            if (!findInfoAuthor) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        'message': 'Account is not exist'
                    })
            }
            else {
                const dataPost = await new Post({
                    'AuthorID': req.accountID,
                    'TypeAuthor': TypeAuthor || 'Cá nhân',
                    'NameAuthor': NameAuthor || findInfoAuthor.FullName,
                    'address': address || findInfoAuthor.Address,
                    'NameProduct': NameProduct,
                    'title': title,
                    'note': note,
                    //map load path image in cloud from Post
                    'urlImage':req.files.map(function (files) {
                        return files.path
                      })
                })
                Product.create(dataPost.NameProduct, function (err, res) {
                    if (err) {
                        res.json(err)
                    }
                })
                dataPost.save(function (err,data) {
                    if (err) {
                        res.json(err)
                    }
                    else {
                        res.status(201)
                            .json({
                                success: true,
                                'message': "Oke",
                                'IDPost':dataPost._id,
                            })
                    }
                })

            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    },
    //Update Product int Post
    UpdateProductInPost:async(req,res)=>{
            try {
                
              
               // const PostNew= await Post.findOne({'_id':req.header.IDPost}) 
               console.log(req.headers.IDPost)
                if(!req.body.ProductPost)
                {
                    return res
                          .status(400)
                          .json({
                              success:false,
                              'message':"don't have Product"
                          })
                }
                else {
                    Post.updateOne({_id: PostNew._id},{
                        $set:{
                            'NameProduct':req.body.ProductPost
                        }
                    },function(err,data){
                        res.json({'message':"oke"})
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
    GetInfoFullPost: async (req, res) => {
        try {
            const post = await Post.find({})
            
            if (!post) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        'message': 'post is not exist'
                    })
            }
            else {
                return res
                    .status(201)
                    .json(post)
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },


    //Get Post by Location/Address
   GetDetailPostByAddress: async(req,res) =>
    {
           try {
                const PostByAddress = await Post.find({address:req.query.address})
                console.log(PostByAddress[0].address)
                if(PostByAddress.address)
                {
                    return res
                        .status(400)
                        .json({
                            success:false,
                            'message':'There are not post in this location'
                        })
                }
                else {
                       return res
                             .status(201)
                              .json({
                                     success:true,
                                     PostByAddress
                                 })
                }
           } catch (error) {
            res.status(500).json({
                success: false,
                'message': error.message
            });
           }
    },
 
    //Get Post by type Author
     
    GetPostByTypeAuthor:async(req,res)=>
    {
    try {
        if(req.query.typeauthor == 'tangcongdong')
        {
            typeauthor = 'Tặng cộng đồng'
        }
        const PostByAuthor = await Post.find({TypeAuthor:typeauthor})
     
        if (PostByAuthor == null)
        {
            res.status(400)
               .json({
                   success:false,
                   'message':'Type Author is not right'
               })
        }
        else (
            res.status(200)
                .json(PostByAuthor)
        )
    } catch (error) {
        res.status(500).json({
            success: false,
            'message': error.message
        });
    }
    },


    //get new post
    GetNewPost : async(req,res)=>{
      try {
          const SortTime = {createdAt:-1};
          Post.find({}).sort(SortTime).limit(12).exec(function(err,docs){
              if(err) 
              {
                   res.json(err);
              } 
              else{
                  res.json(docs)
              }
          })
      } catch (error) {
        res.status(500).json({
            success: false,
            'message': error.message
        });
      }
     }
}