const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivitySchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  limiteOfStu: { type: Number, required: true },
  enroNum: { type: Number, default: 0 },
  detail: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  enroDeadLine: { type: Date, required: true },
  constitutor: { type: String, required: true },
  module: { type: String, required: true }
})

module.exports = mongoose.model('ActivityModel', ActivitySchema)
