const express = require('express');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute')
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 5000


app.use(express.json())

app.use("/api/users", userRoute)

app.get('/', (req, res) => {
  try {
    return res.status(200).send("Backend is running Successfully...")
  } catch (err) {
    return res.status(500).send(err.message)
  }
})



app.listen(PORT, () => {
  try {
    connectDB()
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Server failed to start!", err.message)
  }
  
});