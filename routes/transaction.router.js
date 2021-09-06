const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const transaction = express.Router();
const verifyToken = require("../middleware/auth");
const fileUploader = require("../configs/cloudinary.config");

transaction.post("/create-transaction",verifyToken,fileUploader.array('productImage'), transactionController.createTransaction);
transaction.get("/transaction-sender", verifyToken, transactionController.getTransactionSenderID);
transaction.get("/transaction-receiver",verifyToken,transactionController.getTransactionReceiverID);
transaction.get(
  "/transaction-post",
  verifyToken,
  transactionController.getTransactionPostID
);
transaction.put('/update-connect',verifyToken,transactionController.updateTransactionConnect)
transaction.put(
  "/update-confirm",
  verifyToken,
  transactionController.updateTransactionConfirm
);

module.exports = transaction;