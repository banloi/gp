const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ScoreSchema = new Schema({
  studentNumber: { type: String, required: true },
  activityId: { type: String, rquried: true },
  performance: { type: String, required: true },
  score: { type: Number, required: true },
  activityInfo: {
    type: Schema.Types.ObjectId,
    ref: 'ActivityModel'
  }
})

module.exports = mongoose.model('ScoreModel', ScoreSchema)
