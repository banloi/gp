const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    number: { type: String, required: true, indexes: true },
    password: { type: String, required: true },
    telephone: { type: String, required: true },
    studentInfo: {
      type: Schema.Types.ObjectId,
      ref: 'StudentModel'
    }
  }
)

module.exports = mongoose.model('UserMOdel', UserSchema)
