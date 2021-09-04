const express = require('express')
const doctorsController = require('../controllers/doctors.controller')
const doctors = express.Router()

doctors.get("/get-doctors", doctorsController.getDoctors);

module.exports = doctors;