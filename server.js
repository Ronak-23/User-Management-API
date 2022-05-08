const express= require('express')
const app=express()
require("dotenv").config()
const connectDB= require('./config/db')


connectDB()

app.use(express.json({extended:true}))

app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/update', require('./routes/update'))
app.use('/delete', require('./routes/delete'))

const PORT= process.env.PORT || 5000
app.listen(PORT, () => console.log(`server started at ${PORT}`) )