const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/test?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const connectToMongo = async()=>{
    await mongoose.connect(mongoURI , ()=>{
        console.log("Connected To mongo");
    });
}


module.exports = connectToMongo;