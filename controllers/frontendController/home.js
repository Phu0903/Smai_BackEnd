const mongoose = require('mongoose');
const verifyToken = require('../../middleware/auth')
const Post = require('../../Model/Post');
const Schema = mongoose.Schema;
const Product = require('../../Model/Product')
const User = require('../../Model/User')
const cloudinary_detele = require('../../configs/cloudinary.delete')
const multer = require('multer');
const { json } = require('express');
var ObjectID = require('mongodb').ObjectID;
const { findOne } = require('../../Model/User');
const Account = require('../../Model/Account');

let data_product

module.exports={
    getProduct :async (req,res) => {
      
        try {
            const SortTime = {createdAt:-1};
            await  Post.find({}).sort(SortTime).limit(12).exec(function(err,docs){
                if(err) 
                {
                    
                    res.render('client/home', {status: ["", "", "Lỗi server"] });
                } 
                else{
                    data_product = docs;
                    res.render('client/home', { title: 'Express',data:docs });
                   
                  
                }
            })
          
        } catch (error) {
          res.status(500).json({
              success: false,
              'message': error.message
          });
        }
      
    },
    getDetail: async (req,res)=>{
        const idpost = req.query._id;
      
        try {
            if(!idpost){
                throw new Error("No have Post in data")
            }
            else{
                var phoneNumber;
                const data_post = await Post.findOne({'_id':idpost})
                const authorID = data_post.AuthorID;
                const account = await User.findOne({ 'AccountID':authorID })
                if(account.PhoneNumber == null)
                {
                    phoneNumber = "null"
                }
                phoneNumber = "+84" + account.PhoneNumber;
                if(!data_post)
                {
                    throw new Error("No have Post in data")

                }
                else{                  
                    res.render('client/product_details',{data:data_post,phone:phoneNumber});
                }
                
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                'message': error.message
            });
        }
      
        
    },

    getPhonNumber: async (req, res) => {
        try {
            const account = await Account.findOne({ '_id':req.query._id })
            res.render('client/product_details',{data:data_post});
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },


    search: async(req,res) =>{
        try {
            res.render('client/search');
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

