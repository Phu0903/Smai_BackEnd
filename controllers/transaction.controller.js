const Transaction = require("../Model/Transaction");
const User = require("../Model/User");
const Post = require("../Model/Post");
const Account = require("../Model/Account");
const mongoose = require("mongoose");
const PushNotification = require("../controllers/pushToken.controller")
const Schema = mongoose.Schema;
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
  if (!data) {
    return false;
  }
  return data;
};
//check transaction exists by post id, SenderID, ReceiverID
const CheckExistsTransactionWithSenderIdReceiverID = async (
  postId,
  senderId,
  receiverId
) => {
  const data = await Transaction.findOne({
    PostID: postId,
    SenderID: senderId,
    ReceiverID: receiverId,
  });
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
          //check transaction exists
          const transactionExists =
            await CheckExistsTransactionWithSenderIdReceiverID(
              postID,
              req.accountID,
              dataPost.AuthorID
            );
          if (transactionExists) {
            res.status(404).json(MessageResponse(false, "Transaction already"));
          } else if (!transactionExists && req.accountID != dataPost.AuthorID) {
            //Sender user and Receiver user must not be the same
            //check img
            let pathImage = [];
            if (!req.files) {
              pathImage = [];
            } else {
              req.files.map(function (files) {
                pathImage.push(files.path);
              });
            }
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
              dataTransaction.save(async function (err,data) {
                if (err) {
                  res.status(400).json(MessageResponse(false, "save db error"));
                } else {
                  //bắn notification
                   PushNotification.PushNotification(data);
                  //trạng thái waiting thì bài post sẽ ẩn đi
                  if (status == "waiting") {
                    const hidden = await HidenPostByConnect(postID, false);
                    if (hidden) {
                     return res
                        .status(201)
                        .json(
                          MessageResponse(true, "create transaction success")
                        );
                    } else {
                      return res
                        .status(400)
                        .json(MessageResponse(false, "save db error"));
                    }
                  } else {
                    return res
                      .status(201)
                      .json(
                        MessageResponse(true, "create transaction success")
                      );
                  }
                }
              });
            } else {
              return res
                .status(400)
                .json(
                  MessageResponse(
                    false,
                    "when u create transaction, status must only one of 2 case is null or waiting "
                  )
                );
            }
          } else {
            console.log("5");
            return res
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
      return res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //get Transaction mà mình quan tâm
  getTransactionSenderID: async (req, res) => {
    try {
      const accountId = await User.findOne({ AccountID: req.accountID });
      if (!accountId) {
        return res.status(400).json(MessageResponse(false, "No have SenderID"));
      } else {
        const transaction = await Transaction.find({
          SenderID: mongoose.Types.ObjectId(accountId.AccountID),
        });
        res
          .status(200)
          .json(MessageResponse(true, "Find Success", transaction));
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
        const transaction = await Transaction.find({
          ReceiverID: mongoose.Types.ObjectId(accountId.AccountID),
        });
        res
          .status(200)
          .json(MessageResponse(true, "Find Success", transaction));
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
        const getIdPost = await Transaction.aggregate([
          {
            $match: {
              PostID: mongoose.Types.ObjectId(postIdQuery),
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "SenderID",
              foreignField: "AccountID",
              as: "usersender",
            },
            //$project: dùng để lấy chi tiết phần tử
            // Transaction.aggregate([
            //     {
            //       $lookup:
            //          {
            //            from: "User",
            //            localField: "SenderID",
            //            foreignField: "AccountID",
            //            as: "stockdata"
            //          },

            //     },
            //      {$project:{"SenderID":1,"stockdata":{"FullName":1}}},
            // ])
            // { _id: ObjectId("613787325cabed00231a98ae"),
            //   SenderID: ObjectId("61374dd6830d45002364e253"),
            //   stockdata: [ { FullName: 'Nguyễn Bảnh' } ] }
            // { _id: ObjectId("61381a5b3792001e9c12ef93"),
            //   SenderID: ObjectId("611c0670a52583002233b535"),
            //   stockdata: [ { FullName: 'NguyenDuyPhu' } ] }
          },
          {
            $unwind: "$usersender", // this to convert the array of one object to be an object
          },
        ]).exec();
        res.status(200).json(MessageResponse(true, "Find Success", getIdPost));
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //getTransaction theo status
  //get Transaction liên quan đến một bài viết
  getTransactionByUserID: async (req, res) => {
    try {
      const accountId = await User.findOne({ AccountID: req.accountID });
      if (!accountId) {
        return res.status(400).json(MessageResponse(false, "No have SenderID"));
      } else {

        const transactionbyuser = await Transaction.aggregate([
          {
            $match: {
              $or: [
                {
                  SenderID: mongoose.Types.ObjectId(accountId.AccountID),
                },
                {
                  ReceiverID: mongoose.Types.ObjectId(accountId.AccountID),
                },
              ],
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "SenderID",
              foreignField: "AccountID",
              as: "SenderUser",
            },
          },
          {
            $unwind: "$SenderUser", // this to convert the array of one object to be an object
          },
          {
            $lookup: {
              from: "User",
              localField: "ReceiverID",
              foreignField: "AccountID",
              as: "ReceiverUser",
            },
          },
          {
            $unwind: "$ReceiverUser", // this to convert the array of one object to be an object
          },
          {
            $lookup: {
              from: "Post",
              localField: "PostID",
              foreignField: "_id",
              as: "PostData",
            },
          },
          {
            $unwind: "$PostData",
          },
          { $sort: { updatedAt: -1 } }, //sắp xếp thời gian
        ]);
        res
          .status(200)
          .json(MessageResponse(true, "Find Success", transactionbyuser));
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //update trạng thái connect của bài viết
  updateTransactionStatus: async (req, res) => {
    try {
      const { status, notereceiver } = req.body;
      console.log(req.body)
      const transactionIdQuery = req.query.transactionId;
      console.log(transactionIdQuery);
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
            if (status == "done") {
              if (transactionExists.isStatus != "waiting") {
                res
                  .status(400)
                  .json(MessageResponse(false, "Transaction must connect"));
              }
            }
            //find and update
            const data = await Transaction.findOneAndUpdate(
              { _id: transactionIdQuery },
              {
                $set: {
                  isStatus: status, //update isConnect
                  NoteReceiver: notereceiver || transactionExists.NoteReceiver,
                },
              },
              {
                new: true, //return data new
                runValidators: true, //update nếu nằm trong enum
              }
            );
            if (!data) {
              res.status(400).json(MessageResponse(false, "Failed Update"));
            } else {
              //nếu trường hợp waiting => ẩn post đi
              if (status == "waiting") {
                //hidden post
                const hidden = await HidenPostByConnect(data.PostID, false);
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
                const hidden = await HidenPostByConnect(data.PostID, true);
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
                  await UpdateTransactionToAccount(data.SenderID, data._id);
                //add id transaction to account ReceiverID
                const accountTransactionReceiverID =
                  await UpdateTransactionToAccount(data.ReceiverID, data._id);
                if (
                  !accountTransactionSenderId ||
                  !accountTransactionReceiverID
                ) {
                  res.status(400).json(MessageResponse(false, "Failed Update"));
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
  //đổi soát
  getTransactionConnect: async (req, res) => {
    try {
      const accountId = await User.findOne({ AccountID: req.accountID });
      if (!accountId) {
        return res.status(400).json(MessageResponse(false, "No have Id User"));
      } else {
        const transactionbyuser = await Transaction.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    {
                      ReceiverID: mongoose.Types.ObjectId(accountId.AccountID),
                    },
                    {
                      SenderID: mongoose.Types.ObjectId(accountId.AccountID),
                    },
                  ],
                },
                {
                  $or: [
                    {
                      isStatus: "done",
                    },
                    {
                      isStatus: "waiting",
                    },
                    {
                      isStatus: "cancel",
                    },
                  ],
                },
              ],
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "SenderID",
              foreignField: "AccountID",
              as: "SenderUser",
            },
          },
          {
            $unwind: "$SenderUser", // this to convert the array of one object to be an object
          },
          {
            $lookup: {
              from: "User",
              localField: "ReceiverID",
              foreignField: "AccountID",
              as: "ReceiverUser",
            },
          },
          {
            $unwind: "$ReceiverUser", // this to convert the array of one object to be an object
          },
          {
            $lookup: {
              from: "Post",
              localField: "PostID",
              foreignField: "_id",
              as: "PostData",
            },
          },
          {
            $unwind: "$PostData",
          },
          {
            $project: {
              _id: 1,
              urlImage: 1,
              isStatus: 1,
              SenderID: 1,
              ReceiverID: 1,
              SenderAddress: 1,
              note: 1,
              updatedAt: 1,
              PostData: 1,
              SenderUser: 1,
              ReceiverUser: 1,
              PostID: 1,
            },
          },
          { $sort: { updatedAt: -1 } }, //sắp xếp thời gian
        ]);
        let i = 0;
        let data = [];
        //xác định loại transaction
        for (i in transactionbyuser) {
          let typepost = "";
          //loại bài viết là tặng
          if (transactionbyuser[i].PostData.TypeAuthor == "tangcongdong") {
            typepost = "tang";
            //loại bài viết xin
          } else {
            typepost = "xin";
          }
          let typetransaction;
          //Bài đăng tặng mình là người đi xin 
          if (
            typepost == "tang" &&
            transactionbyuser[i].SenderID == req.accountID
          ) {
            if (transactionbyuser[i].isStatus == "done") {
              typetransaction = "Đã nhận";
            }
            if (transactionbyuser[i].isStatus == "waiting") {
              typetransaction = "Chưa nhận";
            }
            if (transactionbyuser[i].isStatus == "cancel") {
              typetransaction = "Hủy nhận";
            }
          }
          //Bài đăng thuộc loại xin và mình đi tặng 
          if (
            typepost == "xin" &&
            transactionbyuser[i].SenderID == req.accountID
          ) {
            if (transactionbyuser[i].isStatus == "done") {
              typetransaction = "Đã tặng";
            }
            if (transactionbyuser[i].isStatus == "waiting") {
              typetransaction = "Chưa tặng";
            }
            if (transactionbyuser[i].isStatus == "cancel") {
              typetransaction = "Hủy tặng";
            }
          }
          //Bài đăng thuộc loại tặng và mình là chủ bài đăng
          if (
            typepost == "tang" &&
            transactionbyuser[i].ReceiverID == req.accountID
          ) {
            if (transactionbyuser[i].isStatus == "done") {
              typetransaction = "Đã tặng";
            }
            if (transactionbyuser[i].isStatus == "waiting") {
              typetransaction = "Chưa tặng";
            }
            if (transactionbyuser[i].isStatus == "cancel") {
              typetransaction = "Hủy tặng";
            }
          }
          //Bài đăng thuộc loại xin và mình là chủ bài đăng
          if (
            typepost == "xin" &&
            transactionbyuser[i].ReceiverID == req.accountID
          ) {
            if (transactionbyuser[i].isStatus == "done") {
              typetransaction = "Đã nhận";
            }
            if (transactionbyuser[i].isStatus == "waiting") {
              typetransaction = "Chưa nhận";
            }
            if (transactionbyuser[i].isStatus == "cancel") {
              typetransaction = "Hủy nhận";
            }
          }
          var type = { typetransaction: typetransaction };
          obj = { ...type, ...transactionbyuser[i] };
          data.push(obj);
        }
        //phần theo ngày
        let timedata = [];
        for (let j = 0; j < data.length; j++) {
          //cắt 
          const time = data[j].updatedAt.toLocaleString("en-US").split(",");
          //lấy tháng
          const timeSplit = time[0].split("/")
          const year = timeSplit[2]
          const month = timeSplit[0]
          const dataTime = "Tháng " + month + "-" + year;
          let temp = {
            title: dataTime, //lấy tháng theo yêu cầu frontend
            data: data[j],
          };
          timedata.push(temp);
        }

        // group by day
        const groupAndMerge = (arr, groupBy, mergeWith) =>
          Array.from(
            arr
              .reduce(
                (m, o) =>
                  m.set(o[groupBy], {
                    ...o,
                    [mergeWith]: [
                      ...(m.get(o[groupBy])?.[mergeWith] ?? []),
                      o[mergeWith],
                    ],
                  }),
                new Map()
              )
              .values()
          );
        // let data
        const dataMergeTime = groupAndMerge(timedata, "title", "data");
        //count
        let dataDone= []
        for (let i = 0; i < dataMergeTime.length; i++) {
          let transactionSended = 0;
          let transactionReceived = 0;
          let transactionWaitingSend = 0;
          let transactionWaitingReceive = 0;
          let transactionCancelSend = 0;
          let transactionCancelReceive = 0;
          for (let j = 0; j < dataMergeTime[i].data.length; j++) {
            if (dataMergeTime[i].data[j].typetransaction == "Đã nhận") {
              transactionReceived++;
            }
            if (dataMergeTime[i].data[j].typetransaction == "Đã tặng") {
              transactionSended++;
            }
            if (dataMergeTime[i].data[j].typetransaction == "Chưa nhận") {
              transactionWaitingReceive++;
            }
            if (dataMergeTime[i].data[j].typetransaction == "Chưa tặng") {
              transactionWaitingSend++;
            }
            if (dataMergeTime[i].data[j].typetransaction == "Hủy nhận") {
              transactionCancelReceive++;
            }
            if (dataMergeTime[i].data[j].typetransaction == "Hủy tặng") {
              transactionCancelSend++;
            }
            

          }
        
          var countTransaction = {
            countReceived: transactionReceived,
            countSended: transactionSended,
            countWaitingReceive: transactionWaitingReceive,
            countWaitingSend: transactionWaitingSend,
            countCancelReceive: transactionCancelReceive,
            countCancelSend: transactionCancelSend,
          };
          obj = {...countTransaction, ...dataMergeTime[i]};
          dataDone.push(obj);
        }

        //merge tháng
        res.status(200).json(MessageResponse(true, "Find Success", dataDone));
      }
    } catch (error) {
      res.status(500).json(MessageResponse(false, error.message));
    }
  },
};
