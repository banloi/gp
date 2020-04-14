const EnrollmentModel = require('../lib/enrollment')
const StudentModel = require('../lib/students')
const ActivityModel = require('../lib/activities')

exports.createEnrollment = (req, res) => {
  console.log(req.body)
  const number = req.session.number
  const activityId = req.body.activityId
  // const existed = this.existedEnrollment(req.body)
  let studentId = ''
  let enrollId = ''
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
            studentId = resu._id // 获取学号相关的 _id
            resolve()
          }
        }
      )
    })
  }

  function findAct () {
    console.log('调用findAct')
    return new Promise((resolve, reject) => {
      ActivityModel.find(
        { _id: activityId },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            if (resu.length === 0) {
              console.log('不存在该活动')
              reject(new Error('不存在该活动'))
            }
            console.log('findAct')
            resolve(resu)
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
    item.activityInfo = req.body.activityId
    item.studentNumber = req.session.number
    item.activityId = req.body.activityId
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
            res.status(200).json({ message: '报名成功', enrollId: resu._id })
            resolve()
          }
        }
      )
    })
  }

  function addEnroNum () {
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
  }

  /*   this.existedEnrollment(req.body)
    .then(createEnrollment)
    .catch(err => console.log(err)) */

  Promise.all([findStu(), findAct(), existedEnrollment()])
    .then(createEnrollment, err => {
      res.status(400).json({ Error: err.message, enrollId: enrollId })
    })
    .then(addEnroNum)
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
  console.log(enrollId)

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
          } else {
            console.log(resu)
            resolve()
            res.send(resu)
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
