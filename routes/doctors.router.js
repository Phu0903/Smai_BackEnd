const express = require('express')
const doctorsController = require('../controllers/doctors.controller')
const doctors = express.Router()

doctors.get("/get-doctors", doctorsController.getDoctors);
doctors.post("/create-doctor",doctorsController.createDoctors)
module.exports = doctors;