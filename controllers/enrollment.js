const EnrollmentModel = require('../lib/enrollment')
const StudentModel = require('../lib/students')
const ActivityModel = require('../lib/activities')

exports.createEnrollment = (req, res) => {
  console.log(req.body)
  console.log(req.body.number)
  let number = req.jwtInfo.number
  if (req.body.number) {
    number = req.body.number
  }
  const activityId = req.body.activityId
  // const existed = this.existedEnrollment(req.body)
  let studentId = ''
  let enrollId = ''
  const info = {}

  function findStu () {
    console.log('调用findStu')
    return new Promise((resolve, reject) => {
      StudentModel.findOne(
        { number: number },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          if (resu === null) {
            console.log('不存在该学生')
            reject(new Error('不存在该学生'))
          } else {
            console.log('找到学生')
            console.log(resu)
            if (req.body.name) {
              if (resu.name !== req.body.name) {
                console.log('学号和姓名不匹配')
                reject(new Error('学号和姓名不匹配'))
              } else {
                console.log('pipa')
              }
            }
            studentId = resu._id // 获取学号相关的 _id
            info.name = resu.name
            info.class = resu.class
            info.school = resu.school
            info.number = resu.number
            resolve()
          }
        }
      )
    })
  }

  function findAct () {
    console.log('调用findAct')
    return new Promise((resolve, reject) => {
      ActivityModel.findOne(
        { _id: activityId },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            if (resu === null) {
              console.log('不存在该活动')
              reject(new Error('不存在该活动'))
            } else if (resu.enroNum >= resu.limiteOfStu) {
              console.log('人数超限')
              reject(new Error('人数超限'))
            } else {
              console.log('findAct')
              resolve(resu)
            }
          }
        }
      )
    })
  }

  function existedEnrollment () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.findOne(
        {
          studentNumber: number,
          activityId: activityId
        },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(resu)
            if (resu !== null) {
              enrollId = resu._id
              reject(new Error('已报名，无需重复报名'))
            } else if (resu === null) {
              resolve()
            }
          }
        }
      )
    })
  }

  function createEnrollment () {
    const item = {}
    item.studentInfo = studentId
    item.activityInfo = activityId
    item.studentNumber = number
    item.activityId = activityId
    return new Promise((resolve, reject) => {
      EnrollmentModel.create(
        item,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log('报名成功')
            console.log(resu)
            res.status(200).json({ message: '报名成功', enrollId: resu._id, ...info })
            resolve()
          }
        }
      )
      ActivityModel.updateOne(
        { _id: activityId },
        {
          $inc: {
            enroNum: 1
          }
        },
        (err, resu) => {
          if (err) {
            console.log(err)
          } else {
            console.log(resu)
          }
        }
      )
    })
  }

  /*   this.existedEnrollment(req.body)
    .then(createEnrollment)
    .catch(err => console.log(err)) */

  Promise.all([findStu(), findAct(), existedEnrollment()])
    .then(createEnrollment, err => {
      res.status(400).json({ Error: err.message, enrollId: enrollId })
    })
  /*     .then(addEnroNum) */
    .catch(e => {
      console.log(e)
    })
}

exports.findEnrollment = (req, res) => {
  console.log(req.query)
  const id = req.query.activityId
  EnrollmentModel.find(
    { activityId: id },
    'studentInfo'
  )
    .populate({ path: 'studentInfo', model: StudentModel })
    .exec((err, resu) => {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        console.log(resu)
        res.send(resu)
      }
    })
}

// 取消报名
exports.deleteEnrollment = (req, res) => {
  const enrollId = req.body._id
  const activityId = req.body.activityId
  console.log(enrollId, activityId)
  function addEnroNum () {
    console.log('nidaye')
    ActivityModel.updateOne(
      { _id: activityId },
      {
        $inc: {
          enroNum: -1
        }
      },
      (err, resu) => {
        if (err) {
          console.log(err)
        } else {
          console.log(resu)
        }
      }
    )
  }

  function deleteEnro () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.deleteOne(
        { _id: enrollId },
        (err, resu) => {
          if (err) {
            console.log(err.message)
            reject(err)
            res.send(err)
          } else if (resu.deletedCount === 1) {
            console.log(resu)
            resolve()
            res.send(resu)
          } else {
            console.log(resu)
            reject(new Error('取消失败'))
            res.status(400).json({ Error: '取消失败' })
          }
        }
      )
    })
  }

  deleteEnro()
    .then(addEnroNum)
    .catch(e => {
      console.log(e)
    })
}
