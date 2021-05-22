const mongoose = require('mongoose');
const verifyToken = require('../middleware/auth')
const Post = require('../Model/Post');
const Schema = mongoose.Schema;
const Product = require('../Model/Product')
const User = require('../Model/User')
module.exports = {

    //Add post from User
    AddPost: async (req, res) => {
        const {
            TitlePost,
            NotePost,
            NameProduct,
            TypeAuthor,
            NameAuthor,
            Address,
        } = req.body;
        try {

            if (!TitlePost) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: 'ID_user is not exist'
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
                        message: 'Account is not exist'
                    })
            }
            else {
                const dataPost = await new Post({
                    'AuthorID': req.accountID,
                    'TypeAuthor': TypeAuthor || 'Cá nhân',
                    'NameAuthor': NameAuthor || findInfoAuthor.FullName,
                    'address': Address || findInfoAuthor.Address,
                    'NameProduct': NameProduct,
                    'title': TitlePost,
                    'note': NotePost,
                    'urlImage': ["1", "2", "3"]
                })
                Product.create(dataPost.NameProduct, function (err, res) {
                    if (err) {
                        res.json(err)
                    }
                })
                dataPost.save(function (err) {
                    if (err) {
                        res.json(err)
                    }
                    else {
                        res.status(201)
                            .json({
                                success: true,
                                message: "Oke"
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


    //Get Info Post
    GetInfoFullPost: async (req, res) => {
        try {
            const post = await Post.find({})
            if (!post) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: 'post is not exist'
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
                if(!PostByAddress.address)
                {
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:'There are not post in this location'
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
                message: error.message
            });
           }
    },

    //Get Post by type Author

    GetPostByTypeAuthor:async(req,res)=>
    {
    try {
        const PostByAuthor = await Post.find({TypeAuthor:req.query.typeauthor})
        if (PostByAuthor == null)
        {
            res.status(400)
               .json({
                   success:false,
                   message:'Type Author is not right'
               })
        }
        else (
            res.status(200)
                .json({
                    success:true,
                    PostByAuthor
                })
        )
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    }
}