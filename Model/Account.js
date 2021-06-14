const mongoose = require('mongoose');
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
    }
}, {
    collection: 'Account',
    timestamps: true,
});

module.exports = mongoose.model('Account', Account)