const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    message:{
        type : String,
        required : true
    },
    groupId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Group',
        required : false
    },
    receiver:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false
    },
    sender:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    type:{
        type : String,
        enum: ['private', 'group'],
        required : true
    },
}, {
    timestamps : true
})

module.exports = mongoose.model('Message', schema);