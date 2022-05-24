const res = require('express/lib/response');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log('connected to mongoDB');
        return connection
    } catch (error) {
        console.log(error);
        res.status('500').send(error.message)
    }

}

module.exports = connectDB