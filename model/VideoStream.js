const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    link:{
        type : String,
        required : true
    },
}, {
    timestamps : true
})

module.exports = mongoose.model('VideoStream', schema);