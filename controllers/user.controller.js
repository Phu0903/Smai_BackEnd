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
            //Nếu độ dài bằng không thì không cập nhật
            if (IdPost.length == 0) {
                res.status(200).json("null")
            }
            //nêu có thì cập nhật
            else {
                id = IdPost;
                //tìm kiếm những bài đăng của người đó 
                const PostUser = await Post.find({ 'AuthorID': req.accountID })
                //vòng lặp id bài post người đó xêm
                for (let i in id) { 
                    //vòng lặp id mà người đó đăng
                    for (let j in PostUser) {
                        //Nếu không trùng thì nhận 
                        if (PostUser[j]._id == id[i]) {
                            //Màng chứa các id trùng
                           id_temp.push(id[i]); 
                        }
                    }

                }
                //xóa bỏ id bài viết của user
                const id_arr =  id.filter(item => !id_temp.includes(item));
                //check History
                for (let j in UserInfo.History) {
                    id_arr.push(UserInfo.History[j])
                }
                //Đầu tiên, chúng ta tạo mới một phần tử Set và đưa nó vào một mảng.
                // Vì Set chỉ cho phép giá trị duy nhất, tất cả trùng lặp sẽ bị xoá
                const uniqueSet = new Set(id_arr);
                //Bây giờ các giá trị trùng lặp đã bị mất, c
                //chúng ta sẽ hoán đổi lại sang một mảng bằng cách sử dụng phép toán "..."
                const backToArray = [...uniqueSet];
                 //cập nhật  
                User.updateOne({ _id: UserInfo._id },
                    {
                        $set: {
                            'History': backToArray
                        }
                    },
                    {
                        new: true, // trả về mới
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
