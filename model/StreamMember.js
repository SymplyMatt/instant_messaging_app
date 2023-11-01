const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    videoStream:{
        // type : mongoose.Schema.Types.ObjectId,
        type : String,
        ref : 'VideoStream',
        required : true
    },
    user:{
        // type : mongoose.Schema.Types.ObjectId,
        type : String,
        ref : 'User',
        required : true
    },
    peer:{
        type : String,
        required : true
    },
}, {
    timestamps : true
})

module.exports = mongoose.model('StreamMember', schema);