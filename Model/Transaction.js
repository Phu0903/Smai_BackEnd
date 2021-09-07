const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Một giao dịch được tạo ra khi một người tặng đồ cho một đối tượng, một bài viết xin đồ cụ thể. khi đó trường isConnect là true.
//Một giao dịch sinh ra khi người xin đồ muốn xin một món đồ được đăng lên từ một người hay tổ chức khác thì isConnect là false

const Transaction = new mongoose.Schema(
  {
    SenderID: {
      //ID của người tạo giao dịch này
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ReceiverID: {
      //ID của người sở hữu bài viết sinh ra giao dịch
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    PostID: {
      //ID của bài viết sinh ra giao dịch
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    SenderAddress: {
      required: true,
      type: String,
    },
    title: {
      type: String,
    },
    note: {
      type: String,
    },
    urlImage: [],
    // isConnect: false,
    isStatus: {
      type: String,
      default: "null",
      enum: ["null", "waiting", "done", "cancel"],
    },
  },
  {
    collection: "Transaction",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Transaction', Transaction)

