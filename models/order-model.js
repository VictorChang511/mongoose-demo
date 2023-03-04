const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  tradeDate: {
    type: Date
  },
  customer: {
    type: mongoose.Types.ObjectId,
    ref: 'Customer'
  }
})

module.exports = mongoose.model('Order', orderSchema)
