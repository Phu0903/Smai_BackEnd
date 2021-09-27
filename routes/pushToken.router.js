const express = require("express");
const pushToken = express.Router();
const pushTokenController = require('../controllers/pushToken.controller')
const verifyToken = require("../middleware/auth");

pushToken.post("/create-push-token", pushTokenController.CreateTokenDevice);
pushToken.get("/get-notification",pushTokenController.GetNotification)
pushToken.put(
  "/update-notification",
  verifyToken,
  pushTokenController.UpdateExmainedForUser
);
module.exports = pushToken;