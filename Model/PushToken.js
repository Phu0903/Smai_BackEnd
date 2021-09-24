const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DeviceToken = new mongoose.Schema(
  {
    TokenDevice: {
      type: String,
    },
  },
  {
    collection: "DeviceToken",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("DeviceToken", DeviceToken);