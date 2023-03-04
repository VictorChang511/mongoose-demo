const express = require('express')
const router = express.Router()
const Joi = require('joi')
const CustomerModel = require('../models/customer-model')
const OrderModel = require('../models/order-model')

const orderSchema = Joi.object({
  amount: Joi.number().integer().required(),
  customerId: Joi.string().required()
})

const validateOrderData = (req, res, next) => {
  const { error, value } = orderSchema.validate(req.body)
  if (error) {
    return res.status(400).send({ error_message: error.details[0].message })
  } else {
    req.body = value
    next()
  }
}

const validateCustomerId = async (customerId) => {
  const exists = await CustomerModel.findById(customerId)
  return (!!exists)
}

router.post('/', validateOrderData, async (req, res) => {
  try {
    const { amount, customerId } = req.body
    const isValid = await validateCustomerId(customerId)
    if (!isValid) {
      return res.status(400).send({
        status: 'failed',
        error_message: 'Invalid customerId'
      })
    } else {
      const newOrder = new OrderModel({
        amount,
        customer: customerId,
        tradeDate: new Date()
      })
      await newOrder.save()
      res.status(201).send({
        status: 'success',
        data: newOrder
      })
    }
  } catch (error) {
    return res.status(400).send({ status: 'failed', error_message: error.message })
  }
})

router.get('/', async (req, res) => {
  const { customerId } = req.query
  if (customerId) {
    const isValid = await validateCustomerId(customerId)
    if (!isValid) {
      return res.status(400).send({
        error_message: 'Invalid customerId'
      })
    }
  }

  const orders = (customerId)
    ? await OrderModel.find({ customer: customerId }).populate('customer')
    : await OrderModel.find().populate('customer')

  res.send({
    data: orders
  })
})

module.exports = router
