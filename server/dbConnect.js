const mongoose = require("mongoose");

module.exports = async() =>{
    const mongoUri = 'mongodb+srv://akshitthakur128:bVpP16aNsEWYDFNV@cluster0.zqawfmd.mongodb.net/?retryWrites=true&w=majority'
    try{
        const connect = await mongoose.connect(mongoUri,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });    
        console.log(`MongoDb connected: ${connect.connection.host}`);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
    
}