const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    division:String,
    number:Number,
    name: String,
    fatherName: String,
    phone: String,
    whatsapp:String,
    amount:Number,
    houseName:String
});

module.exports =  mongoose.model('Customer', customerSchema);