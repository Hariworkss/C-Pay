// Database connecton with mongoose

const mongoose = require('mongoose');

//defined a connection string  between express and mongoDB
mongoose.connect('mongodb://localhost:27017/CpayServer')

//Model and its schema for storing data in to the database
//Model in express same as mongodb collection name (but in capitalcase and singular form , eg- users-> User )
const User = mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    image:String,
    balance:Number,
    transaction:[],
    chat:[]

})

//exporting 
module.exports = {
    User
}