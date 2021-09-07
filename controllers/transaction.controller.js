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
      // isConnect, //isConnect
      // isConfirm, //isConfirm
      status,
    } = req.body;
    try {
      if (!postID || !senderAddress || !status) {
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
            // let checkConnect, checkConfirm;
            // if (isConnect == "True" || isConnect == "true") {
            //   checkConnect = true;
            // }
            // if (isConnect == "False" || isConnect == "false") {
            //   checkConnect = false;
            // }
            // if (isConfirm == "True" || isConfirm == "true") {
            //   checkConfirm = true;
            // }
            // if (isConfirm == "False" || isConfirm == "false") {
            //   checkConfirm = false;
            // }
            //lưu vào db Transaction
            //when u create transaction, status must only one of 2 case is null or waiting
            if (status == "null" || status == "waiting") {
              const dataTransaction = await new Transaction({
                SenderID: req.accountID,
                ReceiverID: dataPost.AuthorID,
                PostID: postID,
                SenderAddress: senderAddress,
                note: note,
                isStatus: status,
                urlImage: pathImage,
              });
              dataTransaction.save(async function (err) {
                if (err) {
                  res.status(400).json(MessageResponse(false, "save db error"));
                } else {
                  //trạng thái waiting thì bài post sẽ ẩn đi
                  if (status == "waiting") {
                    const hidden = await HidenPostByConnect(postID, false);
                    if (hidden) {
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
                      .json(
                        MessageResponse(true, "create transaction success")
                      );
                  }
                }
              });
            } else {
              res
                .status(400)
                .json(
                  MessageResponse(
                    false,
                    "when u create transaction, status must only one of 2 case is null or waiting "
                  )
                );
            }
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
  updateTransactionStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const transactionIdQuery = req.query.transactionId;
      if (!status || !transactionIdQuery) {
        res
          .status(400)
          .json(MessageResponse(false, "The parameters are not enough"));
      } else {
        //check exists Transaction
        const transactionExists = await CheckExistsTransaction(
          transactionIdQuery
        );
        //if Transaction don't have already
        if (!transactionExists) {
          res.status(404).json(MessageResponse(false, "Not Found"));
        } else {
          //tình trạng transaction phải chưa hoàn thành
          if (transactionExists.isStatus != "done") {
            //trước khi hoàn thành phải connect
            if (status == "done"){
              if(transactionExists.isStatus != "waiting"){
                 res.status(400).json(MessageResponse(false, "Transaction must connect"));
              }
            }
              //find and update
             const data = await Transaction.findOneAndUpdate(
                { _id: transactionIdQuery },
                {
                  $set: {
                    isStatus: status, //update isConnect
                  },
                },
                {
                  new: true, //return data new
                  runValidators: true, //update nếu nằm trong enum
                })
                if (!data) {
                    res
                      .status(400)
                      .json(MessageResponse(false, "Failed Update"));
                  } else {
                    //nếu trường hợp waiting => ẩn post đi
                    if (status == "waiting") {
                      //hidden post
                      const hidden = await HidenPostByConnect(
                        data.PostID,
                        false
                      );
                      //ẩn bài viết đi
                      if (hidden === false) {
                        //failed
                        res
                          .status(400)
                          .json(MessageResponse(false, "Failed HiddenPost"));
                      }
                    }
                    //nếu trường hợp cancel => hiện post
                    if (status == "cancel") {
                      const hidden = await HidenPostByConnect(
                        data.PostID,
                        true
                      );
                      //hiện bài viết đi
                      if (hidden === false) {
                        //failed
                        res
                          .status(400)
                          .json(MessageResponse(false, "Failed HiddenPost"));
                      }
                    }
                    //trường hợp status done => cập nhật transaction vào các account
                    if (status == "done") {
                      //add id transaction to account senderId
                      const accountTransactionSenderId =
                        await UpdateTransactionToAccount(
                          data.SenderID,
                          data._id
                        );
                      //add id transaction to account ReceiverID
                      const accountTransactionReceiverID =
                        await UpdateTransactionToAccount(
                          data.ReceiverID,
                          data._id
                        );
                      if (
                        !accountTransactionSenderId ||
                        !accountTransactionReceiverID
                      ) {
                        res
                          .status(400)
                          .json(MessageResponse(false, "Failed Update"));
                      } else {
                        res
                          .status(200)
                          .json(MessageResponse(true, "Update Success", data));
                      }
                    } else {
                      res
                        .status(200)
                        .json(MessageResponse(true, "Update Success", data));
                    }
                  }   
          } else {
            res.status(400).json(MessageResponse(false, "Transaction done"));
          }
        }
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //Update transactionConfirm
  // updateTransactionConfirm: async (req, res) => {
  //   try {
  //     const { isConfirm } = req.body;
  //     const transactionIdQuery = req.query.transactionId; //transactionId
  //     //check enough
  //     if (!isConfirm || !transactionIdQuery) {
  //       res
  //         .status(400)
  //         .json(MessageResponse(false, "The parameters are not enough"));
  //     } else {
  //       let isConfirmTemp;
  //       if (isConfirm == "True" || isConfirm == "true") {
  //         isConfirmTemp = true;
  //       } else {
  //         res
  //           .status(400)
  //           .json(MessageResponse(false, "The parameters are not wrong"));
  //       }
  //       //kiểm tra tồn tại
  //       const transactionExists = await CheckExistsTransaction(
  //         transactionIdQuery
  //       );
  //       if (!transactionExists) {
  //         res.status(404).json(MessageResponse(false, "Not Found"));
  //       } else {
  //         //transaction must connect
  //         if (transactionExists.isConnect == true) {
  //           //check connect
  //           //update isConfirm for Transaction
  //           const newData = await Transaction.findOneAndUpdate(
  //             { _id: transactionIdQuery },
  //             {
  //               $set: {
  //                 isConfirm: isConfirmTemp,
  //               },
  //             },
  //             {
  //               new: true,
  //             }
  //           );
  //           if (newData === null) {
  //             res.status(400).json(MessageResponse(false, "Failed Update"));
  //           } else {
  //             //add id transaction to account senderId
  //             const accountTransactionSenderId =
  //               await UpdateTransactionToAccount(newData.SenderID, newData._id);
  //             //add id transaction to account ReceiverID
  //             const accountTransactionReceiverID =
  //               await UpdateTransactionToAccount(
  //                 newData.ReceiverID,
  //                 newData._id
  //               );
  //             if (
  //               !accountTransactionSenderId ||
  //               !accountTransactionReceiverID
  //             ) {
  //               res.status(400).json(MessageResponse(false, "Failed Update"));
  //             } else {
  //               res.status(200).json(MessageResponse(true, "Update Success"));
  //             }
  //           }
  //         } else {
  //           res
  //             .status(400)
  //             .json(MessageResponse(false, "Transaction must connect"));
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     res.status(500).json(MessageResponse(false, error.message));
  //   }
  // },
};
