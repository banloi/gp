const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ActivitySchema = new Schema({
  name: { type: String, required: true },
  releaseDate: { type: Date, require: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  details: { type: Date, required: true }
})

module.exports = mongoose.model('Activity', ActivitySchema)
