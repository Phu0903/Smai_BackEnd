const Transaction = require("../Model/Transaction");
const User = require("../Model/User");
const Post = require("../Model/Post");
const Account = require("../Model/Account");

//respone
const MessageResponse = (success, message, data) => {
  return {
    data: {
      success,
      message,
      data,
    },
  };
};
//sẽ ẩn bài Post đi nếu transaction chuyển thành true
const HidenPostByConnect = async (idPost, status) => {
  const data = await Post.findByIdAndUpdate(
    { _id: idPost },
    {
      $set: {
        isDisplay: status,
      },
    },
    {
      new: true,
    }
  );
  if (data === null) {
    return false;
  }
  return true;
};
//check post có tồn tại không
const CheckExistsPost = async (idPost) => {
  const data = await Post.findOne({ _id: idPost });
  if (data === null) {
    return false;
  }
  return data;
};
//const checkConfirm
const CheckExistsTransaction = async (idTransaction) => {
  const data = await Transaction.findOne({ _id: idTransaction });
  if (data === null) {
    return false;
  }
  return data;
};
//add transactionid to account
const UpdateTransactionToAccount = async (accountId, transactionId) => {
  const dataAccount = await Account.findOneAndUpdate(
    { _id: accountId },
    {
      $addToSet: {
        Transaction: transactionId,
      },
    },
    {
      new: true,
    }
  );
  if (dataAccount === null) {
    return false;
  } else {
    return dataAccount;
  }
};
module.exports = {
  createTransaction: async (req, res) => {
    //req body
    const {
      postID, //ID bài viết sinh ra giao dịch
      senderAddress, //Địa chỉ
      note, //note
      isConnect, //isConnect
      isConfirm, //isConfirm
    } = req.body;
    try {
      if (!postID || !senderAddress || !isConnect || !isConfirm) {
        res
          .status(400)
          .json(MessageResponse(false, "The parameters are not enough"));
      } else {
        const senderID = await User.findOne({ AccountID: req.accountID });
        if (!senderID) {
          return res
            .status(404)
            .json(MessageResponse(false, "No have SenderID"));
        }
        const dataPost = await CheckExistsPost(postID);
        if (!dataPost) {
          return res.status(404).json(MessageResponse(false, "No have Post"));
        } else {
          //Sender user and Receiver user must not be the same
          if (req.accountID != dataPost.AuthorID) {
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
              SenderID: req.accountID,
              ReceiverID: dataPost.AuthorID,
              PostID: postID,
              SenderAddress: senderAddress,
              note: note,
              isConnect: checkConnect,
              isConfirm: checkConfirm,
              urlImage: pathImage,
            });
            dataTransaction.save(async function (err) {
              if (err) {
                res.status(400).json(MessageResponse(false, "save db error"));
              } else {
                if (checkConnect === true) {
                  const hidden = await HidenPostByConnect(postID, false);
                  if (hidden === true) {
                    res
                      .status(201)
                      .json(
                        MessageResponse(true, "create transaction success")
                      );
                  } else {
                    res
                      .status(400)
                      .json(MessageResponse(false, "save db error"));
                  }
                } else {
                  res
                    .status(201)
                    .json(MessageResponse(true, "create transaction success"));
                }
              }
            });
          } else {
            res
              .status(400)
              .json(
                MessageResponse(
                  false,
                  "Sender user and Receiver user must not be the same"
                )
              );
          }
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
        if (transaction.length == 0) {
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
        if (transaction.length == 0) {
          res.status(404).json(MessageResponse(false, "Not Found"));
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
  //get Transaction liên quan đến một bài viết
  getTransactionPostID: async (req, res) => {
    try {
      //query
      const postIdQuery = req.query.postId;
      if (!postIdQuery) {
        res
          .status(400)
          .json(MessageResponse(false, "The parameters are not enough"));
      } else {
        const getIdPost = await Transaction.find({ PostID: postIdQuery });
        if (getIdPost.length == 0) {
          res.status(404).json(MessageResponse(false, "Not Found"));
        } else {
          res
            .status(200)
            .json(MessageResponse(true, "Find Success", getIdPost));
        }
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //update trạng thái connect của bài viết
  updateTransactionConnect: async (req, res) => {
    try {
      const { isConnect } = req.body;
      const transactionIdQuery = req.query.transactionId;
      if (!isConnect || !transactionIdQuery) {
        res
          .status(400)
          .json(MessageResponse(false, "The parameters are not enough"));
      } else {
        let isConnectTemp;
        if (isConnect == "True" || isConnect == "true") {
          isConnectTemp = true;
        } else if (isConnect == "False" || isConnect == "false") {
          isConnectTemp = false;
        } else {
          res
            .status(400)
            .json(MessageResponse(false, "The parameters are not wrong"));
        }
        //check exists Transaction
        const transactionExists = await CheckExistsTransaction(
          transactionIdQuery
        );
        //if Transaction don't have already
        if (!transactionExists) {
          res.status(404).json(MessageResponse(false, "Not Found"));
        } else {
          //find and update
          await Transaction.findOneAndUpdate(
            { _id: transactionIdQuery },
            {
              $set: {
                isConnect: isConnectTemp, //update isConnect
              },
            },
            {
              new: true, //return data new
            },
            async function (error, data) {
              if (error) {
                res.status(400).json(MessageResponse(false, "Failed Update"));
              } else {
                //hidden post
                const hidden = await HidenPostByConnect(
                  data.PostID,
                  !isConnectTemp
                ); // isConnect = true change isDisplay = !isConnect = false
                // isConnect = false change isDisplay = !isConnet = true
                if (hidden === true) {
                  //update post successfully
                  res
                    .status(200)
                    .json(MessageResponse(true, "Update Success", data));
                } else {
                  res
                    .status(400)
                    .json(MessageResponse(false, "Failed HiddenPost"));
                }
              }
            }
          );
        }
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //Update transactionConfirm
  updateTransactionConfirm: async (req, res) => {
    try {
      const { isConfirm } = req.body;
      const transactionIdQuery = req.query.transactionId; //transactionId
      //check enough
      if (!isConfirm || !transactionIdQuery) {
        res
          .status(400)
          .json(MessageResponse(false, "The parameters are not enough"));
      } else {
        let isConfirmTemp;
        if (isConfirm == "True" || isConfirm == "true") {
          isConfirmTemp = true;
        } else {
          res
            .status(400)
            .json(MessageResponse(false, "The parameters are not wrong"));
        }
        //kiểm tra tồn tại
        const transactionExists = await CheckExistsTransaction(
          transactionIdQuery
        );
        if (!transactionExists) {
          res.status(404).json(MessageResponse(false, "Not Found"));
        } else {
          //transaction must connect
          if (transactionExists.isConnect == true) {
            //check connect
            //update isConfirm for Transaction
            const newData = await Transaction.findOneAndUpdate(
              { _id: transactionIdQuery },
              {
                $set: {
                  isConfirm: isConfirmTemp,
                },
              },
              {
                new: true,
              }
            );
            if (newData === null) {
              res.status(400).json(MessageResponse(false, "Failed Update"));
            } else {
              //add id transaction to account senderId
              const accountTransactionSenderId =
                await UpdateTransactionToAccount(newData.SenderID, newData._id);
              //add id transaction to account ReceiverID
              const accountTransactionReceiverID =
                await UpdateTransactionToAccount(
                  newData.ReceiverID,
                  newData._id
                );
              if (
                !accountTransactionSenderId ||
                !accountTransactionReceiverID
              ) {
                res.status(400).json(MessageResponse(false, "Failed Update"));
              } else {
                res.status(200).json(MessageResponse(true, "Update Success"));
              }
            }
          } else {
            res
              .status(400)
              .json(MessageResponse(false, "Transaction must connect"));
          }
        }
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
};
