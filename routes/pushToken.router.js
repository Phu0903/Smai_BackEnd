const express = require("express");
const pushToken = express.Router();
const pushTokenController = require('../controllers/pushToken.controller')

pushToken.post("/create-push-token", pushTokenController.CreateTokenDevice);
pushToken.post("/push-notification",pushTokenController.PushNotification)

module.exports = pushToken;