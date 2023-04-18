const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/iNotebook";//mongodb://localhost:27017 
mongoose.set('strictQuery', true);
const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("I am Connnected");
    })
}
module.exports = connectToMongo;