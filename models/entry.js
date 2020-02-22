//DAILY ENTRY SCHEMA

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newEntry= new Schema({
    email:String,
    entryDate:{type:Date, default:Date.now()},
    topic: String,
    entry:String,
    pics:  String/*  [{name: String}]  */
    })

module.exports=mongoose.model('entries',newEntry);
