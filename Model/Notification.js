const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Notification = new mongoose.Schema(
  {
    titleNotification: {
      type: String,
      require: true,
    },
    bodyNotification: {
      type: String,
      require: true,
    },
    //if It is transsaction
    idTransaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    typeNotification: {
      type: String,
      require: true,
      enum:[
          "user",
          "system"
      ]
    },
    ownerID: {
      type:Array,
    }
  },
  {
    collection: "Notification",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Notification", Notification);