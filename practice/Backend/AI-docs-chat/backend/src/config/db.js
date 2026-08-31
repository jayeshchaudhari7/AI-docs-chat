const mongoose = require('mongoose')

const connectDB =async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to DB");

    } catch (error) {
        console.log("error in connecting with DB",error)
    }
}

module.exports = connectDB
