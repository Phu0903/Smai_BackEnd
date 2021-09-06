const { model } = require("mongoose");
const Doctors = require("../Model/Doctors");

const MessageResponse = (success, message, data) => {
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
      res.status(200).json(MessageResponse(true, "Get Success", getDoctors));
    }else{
      res.status(404).json(MessageResponse(false, "Not Found"));

    }
  },
  createDoctors: async (req, res) => {
    const { nameDoctor, timeWork, department, phoneNumber } = req.body;
    if (!nameDoctor || !department || !phoneNumber || timeWork.length == 0) {
      res
        .status(200)
        .json(MessageResponse(false, "The parameters are not enough"));
    } else {
      const dataDoctors = await new Doctors({
        NameDoctor: nameDoctor,
        TimeWork: timeWork,
        Department: department,
        PhoneNumber: phoneNumber,
      });
      dataDoctors.save(async (err, data) => {
        if (err) {
          res.status(400).json(MessageResponse(false, "save db error"));
        } else {
          res
            .status(201)
            .json(MessageResponse(true, "create doctors success", data));
        }
      });
    }
  },
};
