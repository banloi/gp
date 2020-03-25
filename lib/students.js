const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema(
  {
    name: { type: String, required: true, max: 10 },
    number: { type: String, required: true, indexes: true },
    class: { type: String, required: true },
    grade: { type: String, required: true },
    school: { type: String, required: true }
  }
)

/* StudentSchema
  .virtual('grade')
  .get(function () {
    return `20${this.number.slice(3, 5)}级`
  })

StudentSchema
  .virtual('school')
  .get(function () {
    const schoolNumber = this.number.slice(1, 3)
    switch (schoolNumber) {
      case '01':
        return '01学院'
      case '02':
        return '02学院'
      case '03':
        return '03学院'
      case '04':
        return '04学院'
      case '05':
        return '05学院'
      case '06':
        return '06学院'
      case '07':
        return '07学院'
      case '19':
        return '电气与信息学院'
      default:
        return '学院信息错误'
    }
  }) */

module.exports = mongoose.model('StudentModel', StudentSchema)
