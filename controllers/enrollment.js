const EnrollmentModel = require('../lib/enrollment')
const StudentModel = require('../lib/students')
const ActivityModel = require('../lib/activities')

exports.createEnrollment = (req, res) => {
  console.log(req.body)
  // const existed = this.existedEnrollment(req.body)
  function findStu () {
    console.log('调用findStu')
    return new Promise((resolve, reject) => {
      StudentModel.find(
        { number: req.body.studentNumber },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          if (resu.length === 0) {
            console.log('不存在该学生')
            reject(new Error('不存在该学生'))
          }
          console.log('找到学生')
          resolve()
        }
      )
    })
  }

  function findAct () {
    console.log('调用findAct')
    return new Promise((resolve, reject) => {
      ActivityModel.find(
        { _id: req.body.activityId },
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
      EnrollmentModel.find(
        req.body,
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(resu)
            if (resu.length > 0) {
              reject(new Error('已报名，无需重复报名'))
            } else if (resu.length === 0) {
              resolve()
            }
          }
        }
      )
    })
  }

  function createEnrollment () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.create(
        req.body,
        (err, resu) => {
          if (err) {
            console.log(err)
            return
          }
          console.log('报名成功')
          console.log(resu)
          resolve()
        }
      )
    })
  }
  /*   this.existedEnrollment(req.body)
    .then(createEnrollment)
    .catch(err => console.log(err)) */

  Promise.all([findStu(), findAct(), existedEnrollment()]).then(createEnrollment, err => console.log(err))
}

exports.findEnrollemt = (req, res) => {
  EnrollmentModel.find(
    req.body,
    null,
    (err, resu) => {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        console.log(resu)
        res.send(resu)
      }
    }
  )
}
