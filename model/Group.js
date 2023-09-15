const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : false
    },
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
}, {
    timestamps : true
})


module.exports = mongoose.model('Group', schema);