const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://piyushjas:password10@cluster0.ndckwam.mongodb.net/?retryWrites=true&w=majority";//mongodb://localhost:27017 
mongoose.set('strictQuery', true);
const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("I am Connnected");
    })
}
module.exports = connectToMongo;