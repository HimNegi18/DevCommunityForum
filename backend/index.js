const express = require('express')
const dotenv = require("dotenv")
const authRouts = require('./routes/auth')
const app = express()
const port = 5000

dotenv.config();    

app.get("/",(req, res)=>{
    res.send("Home page")
})

app.use("/api/auth", authRoutes)

app.listen(port, ()=>{
    console.log("Server is running");
})