const mongoose = require('mongoose');
const verifyToken = require('../middleware/auth')
const Post = require('../Model/Post');
const Schema = mongoose.Schema;
const Product = require('../Model/Product')
const User = require('../Model/User')
const cloudinary_detele = require('../configs/cloudinary.delete')
const multer = require('multer');
const { json } = require('express');
var ObjectID = require('mongodb').ObjectID;
const { findOne } = require('../Model/User');



module.exports = {
    AddPost: async (req, res) => {
        const {
            title,
            note,
            NameProduct,
            TypeAuthor,
            NameAuthor,
            address,
        } = req.body;
        
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
                    //'address': address || findInfoAuthor.Address,
                    'address': address,
                    'NameProduct': NameProduct,
                    'title': title,
                    'note': note,
                    //map load path image in cloud from Post

                    /*'urlImage':req.files.map(function (files) {
                        return files.path
                      })*/

                })
                dataPost.save(function (err, data) {
                    if (err) {

                        res.json(err)
                    }
                    else {
                        console.log(dataPost._id)
                        res.status(201)
                            .json({
                                success: true,
                                'message': "Oke",
                                'idpost': dataPost._id,
                            })
                    }
                })

            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: error.message,

            });
        }

    },
    //Update Product int Post
    UpdateProductInPost: async (req, res) => {
        try {
            // const PostNew= await Post.findOne({'_id':req.header.IDPost}) 
         
            if (!req.headers.idpost) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        'message': "don't have Post"
                    })
            }
            else {
                Post.updateOne({ _id: req.headers.idpost }, {
                    $set: {
                        'urlImage': req.files.map(function (files) {
                            console.log(files);
                            return files.path
                        })
                    }
                }, function (err, data) {
                    res.json({ 'message': "oke" })
                })
            }
        } catch (error) {
            console.log(error.message);
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
    GetDetailPostByAddress: async (req, res) => {
        try {
            const PostByAddress = await Post.find({ address: req.query.address })

            if (PostByAddress.address) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        'message': 'There are not post in this location'
                    })
            }
            else {
                return res
                    .status(201)
                    .json({
                        success: true,
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

    GetPostByTypeAuthor: async (req, res) => {
        try {
            if (req.query.typeauthor == 'tangcongdong') {
                typeauthor = 'tangcongdong'
            }
            if (req.query.typeauthor == 'canhan') {
                typeauthor = 'Cá nhân'
            }
            if (req.query.typeauthor == 'quy') {
                typeauthor = 'Quỹ/Nhóm từ thiện'
            }
            if (req.query.typeauthor == 'tochuc') {
                typeauthor = 'Tổ chức công ích'
            }
            const SortTime = { createdAt: -1 };
            const PostByAuthor = await Post.find({ TypeAuthor: typeauthor }).sort(SortTime).limit(30);
            if (PostByAuthor == null) {
                res.status(400)
                    .json({
                        success: false,
                        'message': 'Type Author is not right'
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
    GetNewPost: async (req, res) => {
        try {
            const SortTime = { createdAt: -1 };
            Post.find({}).sort(SortTime).limit(12).exec(function (err, docs) {
                if (err) {
                    res.json(err);
                }
                else {
                    res.json(docs)
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                'message': error.message
            });
        }
    },


    //Get Post by AccountID
    GetPostByAccountID: async (req, res) => {
        try {
            const SortTime = { createdAt: -1 };
            const ID = req.accountID;
            const post = await Post.find({ 'AuthorID': ID }).sort(SortTime);

            if (!post[0]._id) {
                res.status(201)
                    .json({
                        'message': 'You do not have post'
                    })
            }
            else {
                res.status(201)
                    .json(post)
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                'message': error.message
            });
        }
    },

    //create Post
    createPost: async (req, res) => {
        const {
            title,
            note,
            NameProduct,
            TypeAuthor,
            NameAuthor,
            address,
        } = req.body;
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
                let productPost = []
                for (let i = 0; i < NameProduct.length; i++) {
                    let temp = await Product.findOne({ "NameProduct": NameProduct[i] })
                    if (temp != null)
                        productPost.push(temp)
                }
                const dataPost = await new Post({
                    'AuthorID': req.accountID,
                    'TypeAuthor': TypeAuthor || 'Cá nhân',
                    'NameAuthor': NameAuthor || findInfoAuthor.FullName,
                    'address': address,
                    'NameProduct': productPost,
                    'title': title,
                    'note': note,
                    'urlImage': req.files.map(function (files) {
                        return files.path
                    })

                })
                Product.create(dataPost.NameProduct, function (err, res) {
                    if (err) {
                        res.json(err)
                    }
                })
                dataPost.save(function (err, data) {
                    if (err) {
                        res.json(err)
                    }
                    else {
                        res.status(201)
                            .json({
                                success: true,
                                'message': "Oke",
                            })
                    }
                })

            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,

            });
        }

    },




//get new post
GetNewPost : async(req,res)=>{
  try {
      const SortTime = {createdAt:-1};
      Post.find({'TypeAuthor':'tangcongdong' }).sort(SortTime).limit(12).exec(function(err,docs){
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
 },


 //Get Post by AccountID
GetPostByAccountID : async(req,res) =>{
     try {
        const SortTime = {createdAt:-1};
         const ID = req.accountID;
         const post = await Post.find({'AuthorID':ID}).sort(SortTime);
       
         if(!post[0]._id)
         {
             res.status(201)
                .json({
                    'message':'You do not have post'
                })
         }
         else{
             res.status(201)
                 .json(post)
         }
     } catch (error) {
        res.status(500).json({
            success: false,
            'message': error.message
        });
     }
 },



 //delete Posst 

 DeletePost: async(req,res) =>{
     try {
         //ID from client
         const id = req.query._id;
         //find News by ID 
         const post =await Post.findOne({'_id':id})
         console.log(id)
         if (!post)
         {
             res.status(400).json({
                success:false,
                message:"do not have Post in data",
            });
         }
         else{
              
            post.urlImage.map(function (url)  {
                //delete image
               
                //Tách chuỗi lấy id
                const image_type = url.split(/[/,.]/)
                //lấy tách ID
                const imageId = image_type[image_type.length -2]

                //xóa ảnh
                cloudinary_detele.uploader.destroy(imageId);
            })
            //xóa tin đăng 
            post.remove(function(err,data){
                if(err)
                {
                 
                    res.status(201).json({
                        message:'Delete post do not successful'
                    })
                }
                else{
                    
                    res.status(201).json("Delete successful")
                }
            })
         }
         
     } catch (error) {
        res.status(500).json({
            success: false,
            'message': error.message
        });
     }
 },
  
 FindId : async(req,res)=>{
   try {
    const id = req.query.ID;
    //find News by ID 
    const post =await Post.findOne({'_id':id})
    console.log(post)
   } catch (error) {
       
   }
 }
}

