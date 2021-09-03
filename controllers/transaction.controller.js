const Transaction = require("../Model/Transaction");
const User = require("../Model/User");

const MessageResponse = (success, message, data) => {
  return {
    data: {
      success,
      message,
      data,
    },
  };
};

module.exports = {
  createTransaction: async (req, res) => {
    //req body
    const {
      receiverID, //Id người sở hữu bài viết sinh ta giao dịch
      postID, //ID bài viết sinh ra giao dịch
      senderAddress, //Địa chỉ
      title, //title
      note, //note
      isConnect, //isConnect
      isConfirm, //isConfirm
    } = req.body;
    try {
      if (
        !receiverID ||
        !postID ||
        !senderAddress ||
        !title ||
        !isConnect ||
        !isConfirm
      ) {
        res
          .status(400)
          .json(MessageResponse(false, "The parameters are not enough"));
      }
      if (!req.accountID) {
        res.status(400).json(MessageResponse(false, "No have accound ID"));
      } else {
        //id người tạo ra giao dịch
        const senderID = await User.findOne({ AccountID: req.accountID });
        if (!senderID) {
          return res
            .status(400)
            .json(MessageResponse(false, "No have SenderID"));
        } else {
          //check img
          let pathImage = [];
          if (!req.files) {
            pathImage = [];
          } else {
            req.files.map(function (files) {
              pathImage.push(files.path);
            });
          }
          //check true false
          let checkConnect, checkConfirm;
          if (isConnect == "True" || isConnect == "true") {
            checkConnect = true;
          }
          if (isConnect == "False" || isConnect == "false") {
            checkConnect = false;
          }
          if (isConfirm == "True" || isConfirm == "true") {
            checkConfirm = true;
          }
          if (isConfirm == "False" || isConfirm == "false") {
            checkConfirm = false;
          }
          //lưu vào db Transaction
          const dataTransaction = await new Transaction({
            SenderID: senderID,
            ReceiverID: receiverID,
            PostID: postID,
            SenderAddress: senderAddress,
            title: title,
            note: note,
            isConnect: checkConnect,
            isConfirm: checkConfirm,
            urlImage: pathImage,
          });
          dataTransaction.save(function (err) {
            if (err) {
              res.status(400).json(MessageResponse(false, "save db error"));
            } else {
              res
                .status(201)
                .json(MessageResponse(true, "create transaction success"));
            }
          });
        }
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //get Transaction mà mình quan tâm
  getTransactionSenderID: async (req, res) => {
    try {
      const accountId = await User.findOne({ AccountID: req.accountID });
      if (!accountId) {
        return res.status(400).json(MessageResponse(false, "No have SenderID"));
      } else {
        const transaction = await Transaction.find({ SenderID: accountId });
        if (!transaction) {
          res.status(404).json(MessageResponse(fasle, "Not Found"));
        } else {
          res
            .status(200)
            .json(MessageResponse(true, "Find Success", transaction));
        }
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //get Transaction mà mình được quan tâm
  getTransactionReceiverID: async (req, res) => {
    try {
      const accountId = await User.findOne({ AccountID: req.accountID });
      if (!accountId) {
        return res.status(400).json(MessageResponse(false, "No have SenderID"));
      } else {
        const transaction = await Transaction.find({ ReceiverID: accountId });
        if (!transaction) {
          res.status(404).json(MessageResponse(fasle, "Not Found"));
        } else {
          res
            .status(200)
            .json(MessageResponse(true, "Find Success", transaction));
        }
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
};
