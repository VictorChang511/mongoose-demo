const express = require('express')
const router = express.Router()
const Joi = require('joi')
const CustomerModel = require('../models/customer-model')

const customerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required()
})

const validateCustomerData = async (req, res, next) => {
  const { error, value } = await customerSchema.validate(req.body)
  if (error) {
    return res.status(400).send({ error_message: error.details[0].message })
  } else {
    req.body = value
    next()
  }
}

router.post('/', validateCustomerData, async (req, res) => {
  try {
    const newCustomer = new CustomerModel(req.body)
    await newCustomer.save()
    return res.status(201).send({
      status: 'success',
      data: newCustomer
    })
  } catch (error) {
    return res.status(400).send({ status: 'failed', error_message: error.message })
  }
})

router.get('/', async (req, res) => {
  const customers = await CustomerModel.find()
  res.send({
    data: customers
  })
})

module.exports = router
