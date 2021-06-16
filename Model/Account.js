const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Account = new mongoose.Schema({
    Password:
    {
        type: String,
        require: true, //yêu cầu

    },
    Rule: {
        type: Number,
        require: true
    },
    PhoneNumber:
    {
        type: Number,
        require: true,
    },
    createAt: {
        type: Schema.Types.Date
    },
    updateAt: {
        type: Schema.Types.Date
    }
}, {
    collection: 'Account',
    timestamps: true,
});

module.exports = mongoose.model('Account', Account)