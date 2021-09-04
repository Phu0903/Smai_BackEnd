const { model } = require('mongoose')
const Doctors = require('../Model/Doctors')

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
    getDoctors: async(req,res)=>{
        const getDoctors = await Doctors.find()
        if(!getDoctors){
          res.status(200).json(
              MessageResponse(
                  true,
                  "Get Success",
                  getDoctors
              )
          )
        }
    }
}