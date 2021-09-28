const DevicePushTokenModel = require("../Model/PushToken");
const NotificationModel = require("../Model/Notification");
const { Expo } = require("expo-server-sdk");
const jwt = require("jsonwebtoken");
const AccountModel = require("../Model/Account");
const expo = new Expo();
const mongoose = require("mongoose");

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
module.exports = {
  //Store Notification for User in transaction
  StroreNotificationToDB: async (
    title,
    body,
    idData,
    typeNotification,
    ownerID
  ) => {
    let owner = {
      ownerID: ownerID,
      examined: false,
    };
    const dataNotification = new NotificationModel({
      titleNotification: title, //title Notification
      bodyNotification: body,
      idTransaction: idData,
      typeNotification: typeNotification, //type Notification
      ownerID: owner,
    });
    dataNotification.save(function (err, data) {
      if (err) {
        return false;
      }
      return true;
    });
  },
  //get Notification
  GetNotification: async (req, res) => {
    try {
      let notificationData;
      //if user login
      const { tokenUser } = req.body;
      if (tokenUser) {
        const decoded = jwt.verify(tokenUser, process.env.ACCESS_TOKEN_SECRET);
        const account = await AccountModel.findOne({ _id: decoded.accountID });
        console.log(account);
        if (account) {
          notificationData = await NotificationModel.find({
            "ownerID.ownerID": mongoose.Types.ObjectId(account._id),
          });
          console.log(notificationData);
        } else {
          notificationData = await NotificationModel.find({
            typeNotification: "system",
          });
        }
      } else {
        notificationData = await NotificationModel.find({
          typeNotification: "system",
        });
      }
      return res.status(201).json({
        success: true,
        message: "OK",
        notificationData: notificationData, //Respone token for client user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  //Update examined
  UpdateExmainedForUser: async (req, res) => {
    try {
      const { idNotification } = req.query;
      if (idNotification) {
        const dataNotification = await NotificationModel.findOneAndUpdate(
          {
            _id: idNotification,
            "ownerID.ownerID": mongoose.Types.ObjectId(req.accountID),
          },
          {
            $set: {
              "ownerID.$.examined": true,
            },
          },
          {
            new: true,
          }
        );
        if (dataNotification) {
          return res
            .status(201)
            .json(MessageResponse(true, "Update success", dataNotification));
        }
      }
      return res.status(404).json(MessageResponse(false, "Update failed"));
    } catch (error) {
      return res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //update token device to send notification
  //Global Device
  // when install the app, global device updated
  CreateTokenDevice: async (req, res) => {
    try {
      const { PushToken } = req.body;
      const ExistsPushToken = await DevicePushTokenModel.findOne({
        TokenDevice: PushToken,
      });
      //if Token already
      if (!ExistsPushToken) {
        const deviceToken = new DevicePushTokenModel({
          TokenDevice: PushToken,
        });
        //save new token to DB
        deviceToken.save(async function (err, data) {
          if (err) {
            return res.status(400).json(MessageResponse(false, err));
          }
          return res
            .status(201)
            .json(MessageResponse(true, "Create success", data));
        });
      } else {
        return res.status(404).json(MessageResponse(false, "Device already"));
      }
    } catch (error) {
      return res.status(500).json(MessageResponse(false, error.message));
    }
  },
  NotificationSystem: async (req, res) => {
    try {
      let notifications = [];
      const { title, body, dataNotification } = req.body;
      const tokenDevice = await DevicePushTokenModel.find({});
      for (let pushToken of tokenDevice) {
        //   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
        console.log(pushToken.TokenDevice);
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken.TokenDevice)) {
          console.error(
            `Push token ${pushToken.TokenDevice} is not a valid Expo push token`
          );
          continue;
        }

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)

        notifications.push({
          to: pushToken.TokenDevice,
          sound: "default",
          title: title,
          body: body,
          data: { data: dataNotification },
        });
      }

      // The Expo push notification service accepts batches of notifications so
      // that you don't need to send 1000 requests to send 1000 notifications. We
      // recommend you batch your notifications to reduce the number of requests
      // and to compress them (notifications with similar content will get
      // compressed).
      let chunks = expo.chunkPushNotifications(notifications);

      (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
          try {
            let receipts = await expo.sendPushNotificationsAsync(chunk);
            return res
              .status(201)
              .json(
                MessageResponse(true, "Push notification success", receipts)
              );
          } catch (error) {
            return res
              .status(400)
              .json(MessageResponse(false, "Push notification false", error));
          }
        }
      })();
    } catch (error) {
      return res.status(500).json(MessageResponse(false, error.message));
    }
  },
  //push notification
  PushNotification: async (title, body, data, tokenDevices) => {
    // Create the messages that you want to send to clents
    let notifications = [];
    console.log(tokenDevices);
    for (let pushToken of tokenDevices) {
      //   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)

      notifications.push({
        to: pushToken,
        sound: "default",
        title: title,
        body: body,
        data: data[0],
      });
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log(receipts);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  },
};
