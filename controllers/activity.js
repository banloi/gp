const { body, validationResult } = require('express-validator/check')
const ActivityModel = require('../lib/activities')
const EnrollmentModel = require('../lib/enrollment')

// 添加验证
exports.actCreatePost = [
/*   body('name', 'Activity name required').isLength({ min: 1, max: 20 }).trim(),
  body('location', 'location is required'),
  body('limitedOfStu', 'limitedOfStu is required'),
  body('detail', 'detail is required'),
  body('startTime', ' startTime is required'),
  body('endTime', 'EndTime is required'),
  body('enroDeadLine', 'enroDeadLine is required'),
  body('module', 'module is required'), */
  (req, res) => {
    /* const error = validationResult(req)
    if (!error.isEmpty()) {
      res.send(error)
    } */
    console.log(req.body)
    // res.send(req.body)

    const startTime = new Date(req.body.startTime)
    const endTime = new Date(req.body.endTime)
    req.body.startTime = startTime
    req.body.endTime = endTime
    req.body.constitutor = req.jwtInfo.name
    console.log(req.body.startTime)
    console.log(startTime instanceof Date)
    console.log(startTime.getTimezoneOffset())
    ActivityModel.create(req.body, (err, activity) => {
      if (err) {
        console.log(err)
        res.send(err)
      }
      if (!err) res.json({ message: '活动创建成功' })
    })
  }
]

exports.actQueryGet = (req, res) => {
  const number = req.jwtInfo.number
  const data = {}
  function findEnro () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.find(
        { studentNumber: number },
        'activityId',
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            data.enrolled = resu
            resolve()
          }
        }
      )
    })
  }
  function findAllAct () {
    return new Promise((resolve, reject) => {
      ActivityModel.find(
        { enroDeadLine: { $gte: Date.now() } },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            data.all = resu
            resolve()
            console.log(resu)
          }
        }
      )
    })
  }

  findEnro()
    .then(findAllAct)
    .then(() => { res.send(data) })
    .catch(e => {
      console.log(e)
    })
}

exports.getActivityInfo = (req, res) => {
  const id = req.query.id
  ActivityModel.findOne(
    { _id: id },
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

exports.putActivityInfo = (req, res) => {
  const { _id, ...info } = req.body
  console.log(info)
  // const { _id, name, location, startTime, endTime, limitOfStu, enroDeadLine, module, detail } = req.body
  ActivityModel.updateOne(
    { _id: _id },
    {
      $set: info
    },
    (err, resu) => {
      if (err) {
        console.log(err)
        res.status(400).send(err)
      } else {
        console.log(resu)
        res.status(200).json({ message: '修改成功' })
      }
    }
  )
}

exports.actDelete = (req, res) => {
  const activityId = req.query.activityId
  ActivityModel.deleteOne(
    {
      _id: activityId
    },
    (err, resu) => {
      console.log(resu)
      if (err) {
        console.log(err)
        res.err(err)
        return
      }
      if (resu.ok === 1 && resu.deletedCount === 0) {
        res.status(400).send('没有需要删除的活动')
      }
      if (resu.ok === 1 && resu.deletedCount === 1) {
        console.log(resu)
        res.send('删除成功')
      }
    }
  )
}

exports.getEnroAct = (req, res) => {
  const constitutor = req.jwtInfo.name
  console.log(constitutor)
  ActivityModel.find(
    {
      constitutor: constitutor,
      enroDeadLine: { $gte: Date.now() }
    },
    null,
    (err, resu) => {
      res.send(resu)
      if (err) {
        console.log(err)
      } else {
        console.log(resu)
      }
    }
  )
}

exports.getUnderway = (req, res) => {
  const constitutor = req.jwtInfo.name
  console.log(constitutor)
  ActivityModel.find(
    {
      constitutor: constitutor,
      startTime: { $lt: Date.now() },
      endTime: { $gte: Date.now() }

    },
    null,
    (err, resu) => {
      res.send(resu)
      if (err) {
        console.log(err)
      } else {
        console.log(resu)
      }
    }
  )
}

exports.getUnrated = (req, res) => {
  const constitutor = req.jwtInfo.name
  ActivityModel.find(
    {
      constitutor: constitutor,
      endTime: { $lt: Date.now() },
      state: 'underway'
    },
    null,
    (err, resu) => {
      if (err) {
        console.log(err)
      } else {
        console.log(resu)
        res.send(resu)
      }
    }
  )
}

exports.complete = (req, res) => {
  const activityId = req.body.activityId
  console.log(activityId)

  function findEnro () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.find(
        {
          activityId: activityId
        },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            if (resu.length > 0) {
              console.log('打分未完成')
              res.status(400).json({ Error: '打分未完成，发布失败' })
              reject(new Error('打分未完成，发布失败'))
            } else if (resu.length === 0) {
              console.log('keyifabu')
              resolve()
            }
          }
        }
      )
    })
  }

  function setComplete () {
    return new Promise((resolve, reject) => {
      ActivityModel.updateOne(
        { _id: activityId },
        {
          $set: { state: 'done' }
        },
        (err, resu) => {
          if (err) {
            reject(err)
          } else {
            console.log(resu)
            res.json({ message: '发布成功' })
            resolve()
          }
        }
      )
    })
  }

  findEnro()
    .then(setComplete)
    .catch(err => {
      console.log(err)
    })
}

exports.getDone = (req, res) => {
  const constitutor = req.jwtInfo.name
  ActivityModel.find(
    {
      constitutor: constitutor,
      state: 'done'
    },
    null,
    (err, resu) => {
      if (err) {
        console.log(err)
      } else {
        console.log(resu)
        res.send(resu)
      }
    }
  )
}
