const mongoose = require('mongoose');
const verifyToken = require('../../middleware/auth')
const Post = require('../../Model/Post');
const Schema = mongoose.Schema;
const Product = require('../../Model/Product')
const User = require('../..//Model/User')
const cloudinary_detele = require('../../configs/cloudinary.delete')
const multer = require('multer');
const { json } = require('express');
var ObjectID = require('mongodb').ObjectID;
const { findOne } = require('../../Model/User');


module.exports={
    getProduct:(req,res)=>{
      
        try {
            const SortTime = {createdAt:-1};
            Post.find({'TypeAuthor':'tangcongdong' }).sort(SortTime).limit(12).exec(function(err,docs){
                if(err) 
                {
                    
                    res.render('client/home', {status: ["", "", "Lỗi server"] });
                } 
                else{
                    
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
    getDetail:(req,res)=>{
        res.render('client/product_details');
    }
}

