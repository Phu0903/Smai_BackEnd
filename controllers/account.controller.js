const argon2d = require("argon2");
const Account = require("../Model/Account");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = {
  //Login
  login: async (req, res) => {
    const { PhoneNumber, Password, TokenDevice } = req.body;
    if (!PhoneNumber || !Password)
      return res.status(400).json({
        success: false,
        message: "Missing PhoneNumber or password",
      });
    try {
      const user = await Account.findOne({ PhoneNumber: PhoneNumber });
      if (!user)
        return res.status(400).json({
          success: false,
          message: "PhoneNumber error.",
        });
      const passwordValid =await argon2d.verify(user.Password, Password);
      if (!user || !passwordValid)
        return res.status(400).json({
          success: false,
          message: "Incorrect PhoneNumber or password",
        });
      //update token device to Account db
      //$addtoSet + upsert : Check exsits and push
      if (TokenDevice) {
        await Account.updateOne(
          { _id: user._id },
          {
            $addToSet: {
              TokenDevice: TokenDevice,
            },
          },
          { upsert: true }
        );
      }
      //create token authentication
      const accessToken = jwt.sign(
        { accountID: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      //respone
      return res.status(201).json({
        success: true,
        message: "OK",
        accessToken: accessToken,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  //register
  register: async (req, res) => {
    const { Password, PhoneNumber, FullName, TokenDevice } = req.body;
    if (!PhoneNumber || !Password) {
      return res.status(400).json({
        success: false,
        message: "PhoneNumber or Password not exist",
      });
    }
    try {
      const user = await Account.findOne({ PhoneNumber: PhoneNumber });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "PhoneNumber already taken",
        });
      } else {
        const hashedPassword = await argon2d.hash(Password); //hasd pass word by argon
        const data = new Account({
          Password: hashedPassword,
          PhoneNumber: PhoneNumber,
          Rule: 1,
        });
        const UserDetail = new User({
          PhoneNumber: PhoneNumber,
          AccountID: data._id,
          FullName: FullName,
        });
        //t???o access token
        const accessToken = jwt.sign(
          { accountID: data._id },
          process.env.ACCESS_TOKEN_SECRET
        );
        data.save(async (err, data) => {
          console.log(data);
          if (TokenDevice) {
            await Account.updateOne(
              { _id: data._id },
              {
                $addToSet: {
                  TokenDevice: TokenDevice,
                },
              },
              { upsert: true }
            );
          }
          await UserDetail.save();
          await res.status(201).json({
            success: true,
            message: "OK",
            accessToken: accessToken, //Respone token for client user
          });
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  //find Phone
  getPhone: async (req, res) => {
    try {
      const user = await Account.findOne({ PhoneNumber: req.body.PhoneNumber });
      if (user) {
        res.status(201).json("PhoneNumber already taken");
      } else {
        res.status(201).json("Oke");
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  //fogot Password
  fogotPassword: async (req, res) => {
    try {
      const password = req.body.Password;
      const accountUser = await Account.findOne({
        PhoneNumber: req.body.PhoneNumber,
      });
      if (!accountUser)
        return res.status(400).json({
          success: false,
          message: "PhoneNumber error.",
        });
      if (!password) {
        throw new Error("No have password for reset password");
      } else {
        const forgotPassword = await argon2d.hash(password); //hasd password by argon
        await accountUser.updateOne(
          {
            Password: forgotPassword,
          },
          {
            new: true, // tr??? v?? d??? li???u m???i
            //H??m n??y tr??? v??? defaut l?? d??? li???u c??
          },
          function (err, data) {
            if (err) {
              throw new Error(err);
            }
            res.status(201).json("Oke");
          }
        );
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  //Logout delete token device
  logoutAccount: async (req, res) => {
    try {
      //Token device
      const { TokenDevice } = req.body;
      //find user
      const accountUser = await Account.findOne({ _id: req.accountID });
      if (accountUser) {
        const data = await Account.findOneAndUpdate(
          { _id: req.accountID },
          {
            $pull: {
              TokenDevice: TokenDevice, //x??a kh???i array
            },
          },
          { new: true }
        );
        return res.status(201).json({
          success: true,
          message: "OK",
          data: data,
        });
      }
      return res.status(400).json({
        success: false,
        message: "There are no users in the database",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
