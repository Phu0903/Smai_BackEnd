const Account = require('../Model/Account');
const User = require('../Model/User');
const Post = require('../Model/Post')
require("dotenv").config();

module.exports = {
    //get infor User
    getInfoUser: async (req, res) => {
        const userName = req.query.UserName;
        const UserInfo = await User.find()
        if (!UserInfo) {
            res.status(400)
            json({
                success: false,
                message: "UserName not exist"
            })
        }
        else {
            res.status(201)
                .json(UserInfo)
        }

    },
    //get Infor User by Id 
    getInfoUserById: async (req, res) => {

        try {
            const Id = req.accountID;
            const UserInfo = await User.findOne({ 'AccountID': Id })
            if (!UserInfo) {
                res.status(400)
                json({
                    success: false,
                    'message': "UserName not exist"
                })
            }
            else {
                res.status(201)
                    .json(UserInfo)
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }


    },
    //Update profile usser
    updateProfile: async (req, res) => {
        //const { FullName, PasswordReset } = req.body
        //const Id = req.accountID;
        try {
                  
                    await User.updateOne({ AccountID: req.accountID },
                        {
                            $set: {
                               // 'FullName': FullName || UserInfo.FullName,
                                'urlIamge': req.file.path
                            }
                        },
                        {
                            new:true
                        }, function (error, data) {
                            res.status(201).json({
                                message: "Oke"
                            })
                        }
                    )
                
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },


    //get address
    getAddress: async (req, res) => {
        try {
            const getAddress = await User.findOne({ 'AccountID': req.accountID })
            if (!getAddress.Address) {
                res.status(400)
                    .json({
                        success: false,
                        message: "no have address"
                    })
            }
            else {
                const temp = getAddress.Address
                res.status(200)
                    .json(
                        {
                            success: true,
                            temp
                        }
                    )
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    //Get PhonNumber by AccountID
    getInfoAuthor: async (req, res) => {
        try {
            const account = await Account.findOne({ '_id': req.query.AuthorID })
            const user = await User.findOne({'AccountID':req.query.AuthorID})
            res.status(201).json({
              "PhoneNumber": account.PhoneNumber,
              "ImgAuthor": user.urlIamge,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    //Update History
    historyPost: async (req, res) => {
        try {
            const UserInfo = await User.findOne({ 'AccountID': req.accountID })
            const IdPost = req.body.IdPost
            var id,id_temp = [];
            //N???u ????? d??i b???ng kh??ng th?? kh??ng c???p nh???t
            if (IdPost.length == 0) {
                res.status(200).json("null")
            }
            //n??u c?? th?? c???p nh???t
            else {
                id = IdPost;
                //t??m ki???m nh???ng b??i ????ng c???a ng?????i ???? 
                const PostUser = await Post.find({ 'AuthorID': req.accountID })
                //v??ng l???p id b??i post ng?????i ???? x??m
                for (let i in id) { 
                    //v??ng l???p id m?? ng?????i ???? ????ng
                    for (let j in PostUser) {
                        //N???u kh??ng tr??ng th?? nh???n 
                        if (PostUser[j]._id == id[i]) {
                            //M??ng ch???a c??c id tr??ng
                           id_temp.push(id[i]); 
                        }
                    }

                }
                //x??a b??? id b??i vi???t c???a user
                const id_arr =  id.filter(item => !id_temp.includes(item));
                //check History
                for (let j in UserInfo.History) {
                    id_arr.push(UserInfo.History[j])
                }
                //?????u ti??n, ch??ng ta t???o m???i m???t ph???n t??? Set v?? ????a n?? v??o m???t m???ng.
                // V?? Set ch??? cho ph??p gi?? tr??? duy nh???t, t???t c??? tr??ng l???p s??? b??? xo??
                const uniqueSet = new Set(id_arr);
                //B??y gi??? c??c gi?? tr??? tr??ng l???p ???? b??? m???t, c
                //ch??ng ta s??? ho??n ?????i l???i sang m???t m???ng b???ng c??ch s??? d???ng ph??p to??n "..."
                const backToArray = [...uniqueSet];
                 //c???p nh???t  
                User.updateOne({ _id: UserInfo._id },
                    {
                        $set: {
                            'History': backToArray
                        }
                    },
                    {
                        new: true, // tr??? v??? m???i
                    }, function (error, data) {
                        if (error) {
                           
                            throw new Error(error)
                        }
                        else {
                            res.status(200).json("oke")
                        }
                    }
                )
            }
  

        } catch (error) {
            console.log(error)
            res.status(500).json({
              
                success: false,
                message: error.message
            });
        }
    },

    //getHistoryPost for user by AccountId
    getHistoryPost: async (req, res) => {
        try {
            const UserInfo = await User.findOne({ 'AccountID': req.accountID })
            if (!UserInfo) {
                res.status(400).json({
                    message: "No have user"
                })
            }
           
            post = [];
            for (let i in UserInfo.History) {
                data = await Post.findOne({ '_id': UserInfo.History[i], confirm: true })
                if(data)
                {
                    post.push(data)
                }
               
            }
            res.json(post)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
