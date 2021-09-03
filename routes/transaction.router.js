const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const transaction = express.Router();

transaction.post("/create-transaction", transactionController.createTransaction);

module.exports = transaction;