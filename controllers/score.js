const ScoreModle = require('../lib/score')
// const StudentModel = require('../lib/students')
// const ActivityModel = require('../lib/activities')
const EnrollmentModel = require('../lib/enrollment')

exports.createScore = (req, res) => {
  function findScore () {
    console.log('调用findScore')
    return new Promise((resolve, reject) => {
      ScoreModle.find(
        { studentNumber: req.body.studentNumber, activityId: req.body.activityId },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
          } else if (resu.length === 0) {
            console.log('未打分')
            resolve()
          } else if (resu.length > 0) {
            console.log('已打分')
            reject(new Error('已打分'))
          }
        }
      )
    })
  }

  const { studentNumber, activityId } = req.body

  function existedEnrollment () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.find(
        { studentNumber, activityId },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(resu)
            if (resu.length > 0) {
              console.log('已报名，可以打分')
              resolve()
            } else if (resu.length === 0) {
              reject(new Error('未报名该活动'))
            }
          }
        }
      )
    })
  }

  function createScore () {
    return new Promise((resolve, reject) => {
      console.log('use createScore')
      ScoreModle.create(
        req.body,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
            res.send(err)
          } else {
            console.log('created')
            console.log(resu)
            resolve()
            res.send(resu)
          }
        }
      )
    })
  }

  function removeEnrollment () {
    EnrollmentModel
      .deleteOne(
        { studentNumber, activityId },
        (err, resu) => {
          if (err) {
            console.log(err)
          } else {
            console.log('remove')
            console.log(resu)
          }
        }
      )
  }

  /*   existedEnrollment
    .then(createScore)
    .catch(err => console.log(err)) */

  Promise.all([findScore(), existedEnrollment()])
    .then(createScore)
    .then(removeEnrollment)
    .catch(err => {
      console.log(err)
    })
  console.log('-----------------------------------------------')
}

exports.getScore = (req, res) => {
  console.log(req.body)
  ScoreModle.find(
    req.query,
    null,
    (err, resu) => {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        res.send(resu)
      }
    }
  )
}

/* function findStu() {
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
        console.log(resolve)
        resolve()
      }
    )
  })
}

function findAct() {
  console.log('调用findAct')
  return new Promise((resolve, reject) => {
    ActivityModel.find(
      { _id: req.body.activityId },
      null,
      (err, resu) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        if (resu.length === 0) {
          console.log('不存在该活动')
          return reject(new Error('dead'))
        }
        console.log('findAct')
        return resolve(resu)
      }
    )
  })
} */
