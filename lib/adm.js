const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdmSchema = new Schema({
  name: { type: String, required: true, indexes: true },
  password: { type: String, required: true },
  type: { type: String, required: true, enum: ['user', 'act'] }
})

module.exports = mongoose.model('AdmModel', AdmSchema)
