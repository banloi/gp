const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ScoreSchema = new Schema({
  studentNumber: { type: String, required: true },
  activityId: { type: String, rquried: true },
  performance: { type: String, required: true },
  score: { type: Number, required: true }
})

module.exports = mongoose.model('ScoreModel', ScoreSchema)
