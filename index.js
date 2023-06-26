require("dotenv").config();
const express = require ("express")
const cors = require('cors')
const mongoose = require ('mongoose')
const router = require('./routes/index.js')

mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => console.log('DB ok'))
   .catch((err) => console.log('DB error', err))

const app = express()

app.use(express.json()) 
app.use(cors())
app.use('/api', router)


app.listen(4444, (err) => {
   if (err) {
      return console.log(err)
   }
   console.log("Server OK")
})