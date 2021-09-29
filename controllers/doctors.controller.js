const { model } = require("mongoose");
const Doctors = require("../Model/Doctors");

const messageResponse = (success, message, data) => {
  return {
    data: {
      success,
      message,
      data,
    },
  };
};

module.exports = {
  getDoctors: async (req, res) => {
    const getDoctors = await Doctors.find({});
    if (getDoctors) {
      res.status(200).json(messageResponse(true, "Get Success", getDoctors));
    }else{
      res.status(404).json(messageResponse(false, "Not Found"));

    }
  },
  createDoctors: async (req, res) => {
    const { nameDoctor, timeWork, department, phoneNumber } = req.body;
    if (!nameDoctor || !department || !phoneNumber || timeWork.length == 0) {
      res
        .status(200)
        .json(messageResponse(false, "The parameters are not enough"));
    } else {
      const dataDoctors = await new Doctors({
        NameDoctor: nameDoctor,
        TimeWork: timeWork,
        Department: department,
        PhoneNumber: phoneNumber,
      });
      dataDoctors.save(async (err, data) => {
        if (err) {
          res.status(400).json(messageResponse(false, "save db error"));
        } else {
          res
            .status(201)
            .json(messageResponse(true, "create doctors success", data));
        }
      });
    }
  },
};
