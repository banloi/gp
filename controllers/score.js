const ScoreModel = require('../lib/score')
const StudentModel = require('../lib/students')
// const ActivityModel = require('../lib/activities')
const EnrollmentModel = require('../lib/enrollment')

exports.getRateList = (req, res) => {
  const activityId = req.query.activityId
  const list = {}
  function getUnrated () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.find(
        { activityId },
        'studentInfo'
      )
        .populate({ path: 'studentInfo', model: StudentModel })
        .exec(
          (err, resu) => {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              console.log(resu)
              list.unRated = resu
              resolve()
            }
          })
    })
  }
  function getRated () {
    return new Promise((resolve, reject) => {
      ScoreModel.find(
        { activityId },
        'studentInfo score performance'
      )
        .populate({ path: 'studentInfo', model: StudentModel })
        .exec(
          (err, resu) => {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              console.log(resu)
              list.rated = resu
              resolve()
            }
          })
    })
  }
  function send () {
    res.send(list)
  }

  getUnrated()
    .then(getRated)
    .then(send)
    .catch(err => {
      console.log(err)
      res.send(err).status(400)
    })
}

exports.createScore = (req, res) => {
  const { studentNumber, activityId, studentId } = req.body
  const { performance, score } = req.body
  console.log('ppp')
  console.log(studentId)

  function findScore () {
    console.log('调用findScore')
    return new Promise((resolve, reject) => {
      ScoreModel.find(
        {
          studentNumber: studentNumber,
          activityId: activityId
        },
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
      ScoreModel.create(
        {
          studentNumber: studentNumber,
          activityId: activityId,
          performance: performance,
          score: score,
          activityInfo: activityId,
          studentInfo: studentId
        },
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
            res.send(err)
          } else {
            console.log('created')
            console.log(resu)
            resolve()
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

  Promise.all([findScore(), existedEnrollment()])
    .then(createScore)
    .then(removeEnrollment)
    .then(
      () => {
        res.json({ message: '打分成功' })
      }
    )
    .catch(err => {
      console.log(err)
      res.err(err)
    })
  console.log('-----------------------------------------------')
}

exports.getScore = (req, res) => {
  console.log(req.body)
  ScoreModel.find(
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

exports.getAdmScore = (req, res) => {
  const activityId = req.query
  console.log(activityId)
  ScoreModel.find(
    activityId,
    'studentInfo score performance'
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
