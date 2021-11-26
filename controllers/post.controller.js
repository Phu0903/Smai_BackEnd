const Post = require("../Model/Post");
const User = require("../Model/User");
const TransactionModel = require("../Model/Transaction");
const NotificationModel = require("../Model/Notification");
const cloudinary_detele = require("../configs/cloudinary.delete");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = {
  addPost: async (req, res) => {
    const { title, note, NameProduct, TypeAuthor, NameAuthor, address } =
      req.body;
    try {
      const findInfoAuthor = await User.findOne({ AccountID: req.accountID });
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is not exist",
        });
      }
      if (!findInfoAuthor) {
        return res.status(400).json({
          success: false,
          message: "Account is not exist",
        });
      } else {
        let Confirm;
        if (TypeAuthor == "tangcongdong") {
          Confirm = true;
        } else {
          Confirm = true;
        }
        const dataPost = await new Post({
          AuthorID: req.accountID,
          TypeAuthor: TypeAuthor || "Cá nhân",
          NameAuthor: NameAuthor || findInfoAuthor.FullName,
          address: address,
          NameProduct: NameProduct,
          title: title,
          note: note,
          confirm: Confirm || false,
        });
        /*for( let i in dataPost.NameProduct)
                {
                    console.log(dataPost.NameProduct[i])
                    const dataProduct = await new Product({
                        'NameProduct':dataPost.NameProduct[i].NameProduct,
                        'Category':dataPost.NameProduct[i].Category
                    })
                    dataProduct.save();
                }*/
        dataPost.save(function (error, data) {
          if (error) {
            res.status(400).json(error);
          } else {
            res.status(201).json({
              success: true,
              message: "Oke",
              idpost: dataPost._id,
            });
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //Update Product in Post
  updateProductInPost: async (req, res) => {
    try {
      if (!req.headers.idpost) {
        return res.status(400).json({
          success: false,
          message: "don't have Post",
        });
      } else {
        await Post.updateOne(
          { _id: req.headers.idpost },
          {
            $set: {
              urlImage: req.files.map(function (files) {
                return files.path;
              }),
            },
          },
          function (err, data) {
            res.json({ message: "oke" });
          }
        );
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  //Get Info Post
  getInfoFullPost: async (req, res) => {
    try {
      const post = await Post.find({ confirm: true, isDisplay: true });
      if (!post) {
        return res.status(400).json({
          success: false,
          message: "post is not exist",
        });
      } else {
        return res.status(201).json(post);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  //Get Post by Location/Address
  getDetailPostByAddress: async (req, res) => {
    try {
      const PostByAddress = await Post.find({ address: req.query.address });

      if (PostByAddress.address) {
        return res.status(400).json({
          success: false,
          message: "There are not post in this location",
        });
      } else {
        return res.status(201).json({
          success: true,
          PostByAddress,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  //Get Post by type Author

  getPostByTypeAuthor: async (req, res) => {
    try {
      if (req.query.typeauthor == "tangcongdong") {
        typeauthor = "tangcongdong";
      }
      if (req.query.typeauthor == "canhan") {
        typeauthor = "Cá nhân";
      }
      if (req.query.typeauthor == "quy") {
        typeauthor = "Quỹ/Nhóm từ thiện";
      }
      if (req.query.typeauthor == "tochuc") {
        typeauthor = "Tổ chức công ích";
      }
      const SortTime = { createdAt: -1 };
      const PostByAuthor = await Post.find({
        TypeAuthor: typeauthor,
        confirm: true,
        isDisplay: true,
      })
        .sort(SortTime)
        .limit(30);
      if (PostByAuthor == null) {
        res.status(400).json({
          success: false,
          message: "Type Author is not right",
        });
      } else res.status(200).json(PostByAuthor);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //get new post for "Tặng công đồng"
  getNewPost: async (req, res) => {
    try {
      const SortTime = { createdAt: -1 };
      Post.find({ TypeAuthor: "tangcongdong", isDisplay: true })
        .sort(SortTime)
        .limit(12)
        .exec(function (err, docs) {
          if (err) {
            res.json(err);
          } else {
            res.json(docs);
          }
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //get 10 post for "Người khó khăn" in home page
  getPostUserNeedHelp: async (req, res) => {
    try {
      const SortTime = { createdAt: -1 };
      const post = await Post.find({
        TypeAuthor: { $ne: "tangcongdong" },
        confirm: true,
        isDisplay: true,
      }) //Not have "tangcongdong"
        .sort(SortTime)
        .limit(10);
      res.status(200).json({
        success: true,
        message: "Oke",
        data: post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //delete Posst
  deletePost: async (req, res) => {
    try {
      //ID from client
      const id = req.query._id;
      //find News by ID
      const post = await Post.findOne({ _id: id });
      if (!post) {
        res.status(400).json({
          success: false,
          message: "do not have Post in data",
        });
      } else {
        //xóa bài đăng trong lịch sử của họ
        await Promise.all([]);
        const UserHistory = await User.find({});
        for (let i in UserHistory) {
          await User.findOneAndUpdate(
            { _id: UserHistory[i]._id },
            {
              $pull: {
                History: id,
              },
            },
            {
              new: true,
            }
          );
        }

        //xóa ảnh trong cloundinary
        const deleteClodinary = await post.urlImage.map(function (url) {
          //delete image

          //Tách chuỗi lấy id
          const image_type = url.split(/[/,.]/);
          //lấy tách ID
          const imageId = image_type[image_type.length - 2];

          //xóa ảnh
          cloudinary_detele.uploader.destroy(imageId);
        });
        await Promise.all(deleteClodinary).catch((e) =>
          console.log(`Error in sending email for the batch ${i} - ${e}`)
        );
        //delete transaction liên quan đến bài viết
        await TransactionModel.deleteMany(
          { PostID: post._id },
          function (err, _) {
            if (err) {
              res.status(201).json({
                message: "Delete post do not successful",
              });
            }
            //xóa tin đăng
            post.remove(function (err, data) {
              if (err) {
                res.status(201).json({
                  message: "Delete post do not successful",
                });
              } else {
                res.status(201).json("Delete successful");
              }
            });
          }
        );
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //Find Post by id
  findId: async (req, res) => {
    try {
      const id = req.query.ID;
      //find News by ID
      const post = await Post.findOne({ _id: id });
      console.log(post);
    } catch (error) {}
  },

  //search item
  searchPost: async (req, res) => {
    try {
      const key = `"${req.query.searchterm}"`;
      console.log(req.query.searchterm);
      const post = await Post.find({ $text: { $search: key } });
      if (!post) {
        res.json({
          message: "No have post in data",
        });
      } else {
        res.json(post);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //Get Post by AccountID
  getPostByAccountID: async (req, res) => {
    try {
      const SortTime = { createdAt: -1 };
      const ID = req.accountID;
      const post = await Post.find({ AuthorID: ID }).sort(SortTime);
      if (!post[0]) {
        res.status(201).json([]);
      } else {
        res.status(201).json(post);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //hiden Post
  //bad Post
  //check bad Post
  updatePost: async (req, res) => {
    try {
      idPost = req.query.idpost;
      statusDisplay = req.body.statusdiplay;
      badPost = req.body.badpost;
      noteBadTemp = req.body.noteBad;
      let data;
      if (idPost && !badPost) {
        data = await Post.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(idPost) },
          {
            $set: {
              isDisplay: statusDisplay,
            },
          },
          {
            new: true,
          }
        );
      }
      if (badPost == "1" && idPost) {
        data = await Post.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(idPost) },
          {
            // $inc: { totalReport: 1 },
            $push: {
              noteBad: noteBadTemp,
            },
          },
          {
            new: true,
          }
        );
        //check bad post
        if (data.noteBad.length >= 3) {
          data = await Post.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(idPost) },
            {
              $set: {
                confirm: false,
              },
            },
            {
              new: true,
            }
          );
        }
      }
      if (data == null) {
        return res.status(404).json({
          success: true,
          message: "error update",
        });
      }
      return res.status(201).json({
        success: true,
        message: data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  //delete All Post with Admin
  deletePostAdmin: async (req, res) => {
    try {
      typeAuthor = req.body.typeAuthor;
      //find News by ID
      const post = await Post.find({ TypeAuthor: typeAuthor });

      if (!post) {
        return res.status(400).json({
          success: false,
          message: "do not have Post in data",
        });
      } else {
        for (let j in post) {
          //xóa bài đăng trong lịch sử của họ
          const UserHistory = await User.find({});
          for (let i in UserHistory) {
            await User.findOneAndUpdate(
              { _id: UserHistory[i]._id },
              {
                $pull: {
                  History: post[j]._id,
                },
              },
              {
                new: true,
              }
            );
          }
          // //xóa ảnh trong cloundinary
          await post[j].urlImage.map(function (url) {
            //delete image

            //Tách chuỗi lấy id
            const image_type = url.split(/[/,.]/);
            //lấy tách ID
            const imageId = image_type[image_type.length - 2];

            //xóa ảnh
            cloudinary_detele.uploader.destroy(imageId);
          });
          //notification
          transactionData = await TransactionModel.find({
            PostID: post[j]._id,
          });
          for (let k in transactionData) {
            await NotificationModel.deleteMany(
              { idTransaction: transactionData[k]._id },
              function (err) {
                if (err) {
                  return res.status(401).json({
                    message: "Delete post do not successful",
                  });
                }
              }
            );
          }
          //delete transaction liên quan đến bài viết
          await TransactionModel.deleteMany(
            { PostID: post[j]._id },
            function (err) {
              if (err) {
                return res.status(401).json({
                  message: "Delete post do not successful",
                });
              }
              //xóa tin đăng
              post[j].remove(function (err, data) {
                if (err) {
                  return res.status(401).json({
                    message: "Delete post do not successful",
                  });
                }
              });
            }
          );
        }
      }
      return res.status(201).json("Delete successful");
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
