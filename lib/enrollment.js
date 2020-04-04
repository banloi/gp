const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 报名登记表，打分后删除
const EnrollmentSchema = new Schema({
  studentNumber: { type: String, required: true },
  studentInfo: {
    type: Schema.Types.ObjectId,
    ref: 'StudentModel'
  },
  activityId: { type: String, required: true },
  activityInfo: {
    type: Schema.Types.ObjectId,
    ref: 'ActivityModel'
  }
})

module.exports = mongoose.model('EnrollmentModel', EnrollmentSchema)
