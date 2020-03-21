const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 报名登记表，打分后删除
const EnrollmentSchema = new Schema({
  studentNumber: { type: String, required: true },
  activityId: { type: String, required: true }
})

module.exports = mongoose.model('EnrollmentModel', EnrollmentSchema)
