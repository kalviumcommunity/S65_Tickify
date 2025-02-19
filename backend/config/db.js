const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully...")
    } catch (err) {
        console.error(`Error: ${err.message}`)
    }

}

module.exports = connectDB