const mongoose = require('mongoose');
const Account = require('./Account');
const Schema = mongoose.Schema

var User = new mongoose.Schema({
    // UserName: {
    //     type: String,
    // },
    FullName: {
        type: String,
    },
    BirthDay: {
        type: String,
    },
    Address: {
        type: String,
    },
    Gender: {
        type: String,
    },
    // PhoneNumber: {
    //     type: Number,
    //     ref: 'Account'
    // },
    urlIamge:{
       type: String,
    },
    AccountID: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    createAt: {
        type: Schema.Types.Date
    },
    updateAt: {
        type: Schema.Types.Date
    },
    History:[]
}, {
    collection: 'User',
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('User', User)