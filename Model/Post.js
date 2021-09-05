const mongoose = require('mongoose');
const Product = require('../Model/Product').schema
const Schema = mongoose.Schema;
const Post = new mongoose.Schema(
  {
    AuthorID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    TypeAuthor: {
      type: String,
      require: true,
      enum: [
        "Cá nhân",
        "Quỹ/Nhóm từ thiện",
        "Tổ chức công ích",
        "tangcongdong",
      ],
    },
    NameAuthor: {
      required: true,
      type: String,
    },
    address: {
      required: true,
      type: String,
    },

    NameProduct: {
      type: [Product],
      require: true,
    },
    title: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    urlImage: [],
    confirm: {
      type: Boolean,
    },
    isDisplay: {
      type: Boolean,
      default: true, //là true
    },
    Transaction: [], //Đối với bài viết xin thì trong đây chỉ chứa một phần tử, đối với bài viết tặng thì chứa nhiều phần tử
  },
  {
    collection: "Post",
    timestamps: true,
    versionKey: false,
  }
);

Post.index({ 'NameProduct': 'text', 'title': 'text', 'address': 'text' }); //đm bắt buộc dùng này mới tìm đc nghen

module.exports = mongoose.model('Post', Post)
