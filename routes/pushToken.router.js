const express = require("express");
const pushToken = express.Router();
const pushTokenController = require("../controllers/pushToken.controller");
const verifyToken = require("../middleware/auth");

pushToken.post("/create-push-token", pushTokenController.createTokenDevice);
pushToken.get("/get-notification", pushTokenController.getNotification);
pushToken.put(
  "/update-notification",
  verifyToken,
  pushTokenController.updateExmainedForUser
);
pushToken.post(
  "/notification-system",
  pushTokenController.notificationSystem
);
module.exports = pushToken;
