module.export = {
  studentID: {
    type: 'string',
    required: true
  },
  name: {
    type: 'string',
    required: true
  },
  gender: {
    type: 'string',
    enum: ['m', 'f'],
    required: true
  },
  school: {
    type: 'string',
    enum: ['电气与信息学院', '资源与环境学院'],
    required: true
  },
  class: {
    type: 'string',
    enum: ['微机1601', '微机1602', '微机1603', '微机1605', '微机1606'],
    required: true
  }
}
