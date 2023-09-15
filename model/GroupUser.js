const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    groupId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Group',
        required : true
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    isAdmin:{
        type : Boolean,
        default : false
    },
}, {
    timestamps : true
})

module.exports = mongoose.model('GroupUser', schema);