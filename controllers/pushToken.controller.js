const DevicePushTokenModel = require("../Model/PushToken");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

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
  //update token device to send notification
  //Global Device
  // when install the app, global device updated
  CreateTokenDevice: async (req, res) => {
    try {
      const { PushToken } = req.body;
      const ExistsPushToken = await DevicePushTokenModel.findOne({
        TokenDevice: PushToken,
      });
      if (!ExistsPushToken) {
        const deviceToken = new DevicePushTokenModel({
          TokenDevice: PushToken,
        });
        // deviceToken
        //   .save()
        //   .then((data) => {
        //     res.status(201).json(MessageResponse(true, "Create success", data));
        //   })
        //   .catch((err) => res.status(400).json(MessageResponse(false, err)));
        deviceToken.save(async function (err, data) {
          if (err) {
            return res.status(400).json(MessageResponse(false, err));
          }
          return res.status(201).json(MessageResponse(true, "Create success", data));
        });
      } else {
        return res.status(404).json(MessageResponse(false, "Device already"));
      }
    } catch (error) {
      return res.status(500).json(MessageResponse(false, error.message));
    }
  },

  //push notification
  PushNotification: async(data)=>{
    // Create the messages that you want to send to clents
    let notifications = [];
    // for (let pushToken of savedPushTokens) {
    //   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    //   // Check that all your push tokens appear to be valid Expo push tokens
    //   if (!Expo.isExpoPushToken(pushToken)) {
    //     console.error(`Push token ${pushToken} is not a valid Expo push token`);
    //     continue;
    //   }

    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    // ExponentPushToken[v05HDrHOULW2jodQNWOG5B];
    //ExponentPushToken[CoTCwHPar8Y0RJrAfPQZ8C]
    notifications.push({
      to: "ExponentPushToken[sa8SANE44TXgGVp2i4GT7Z]",
      sound: "default",
      title: "Phu",
      body: "phu",
      data:  data ,
    });
    // }

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
  }
};
