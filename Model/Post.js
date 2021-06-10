const mongoose = require('mongoose');
const Product = require('../Model/Product').schema
const Schema = mongoose.Schema;
const Post = new mongoose.Schema({
  AuthorID: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },


  TypeAuthor: {
    type: String,
    require: true,
    enum: [
      'Cá nhân',
      'Quỹ/Nhóm từ thiện',
      'Tổ chức công ích',
      'tangcongdong'
    ]

  },
  NameAuthor: {
    required: true,
    type: String,

  },
  address: {
    required: true,
    type: String,
  },

  NameProduct:
  {
    type: [Product],
    require: true
  },
  title: {
    type: String,
    required: true
  },
  note: {
    type: String,

  },
  urlImage: []
  /*expireAt: {
   type: Date,
   default: Date.now,
   expires: 3600 , // giới hạn thời gian 3600s
 },*/

}, {
  collection: 'Post',
  timestamps: true,
  versionKey: false,
})
module.exports = mongoose.model('Post', Post)
