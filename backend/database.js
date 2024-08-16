//IMPORTING MONGOOSE
const mongoose = require('mongoose');

//FUNC TO CONNECT NODE WITH MONGODB
const connection = () => {
    mongoose.connect(process.env.DB_URL, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    }).then(() => {
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    }).catch((err) => {
        console.error(err);
    });
}

module.exports = connection
