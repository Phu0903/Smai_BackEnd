const Post = require("../Model/Transaction");

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
      //Id người sở hữu bài viết sinh ta giao dịch
      ReceiverID,
      PostID, //ID bài viết sinh ra giao dịch
      SenderAddress, //Địa chỉ
      Title, //title
      Note, //note
      IsConnect, //isConnect
      IsConfirm, //isConfirm
    } = req.body;
    try {
      if (
        !ReceiverID ||
        !PostID ||
        !SenderAddress ||
        !Title ||
        !IsConnect ||
        !IsConfirm
      ) {
         res.status(400).json(
             MessageResponse(
                 false, 
                 "The parameters are not enough",
                 )
           );
      }else{
          
      }
    } catch (error) {
        res.status(500).json(
            MessageResponse(
                false,
                error.message
            )
        )
    }
  },
};
