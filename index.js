const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

const customerRoute = require('./routes/customer-route')
const orderRoute = require('./routes/order-route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/customer', customerRoute)
app.use('/api/order', orderRoute)

app.get('/api/test', (req, res) => {
  res.send('API Test')
})

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mongoose-demo'
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error))

app.listen(8080, () => console.log('Server running on port 8080'))
