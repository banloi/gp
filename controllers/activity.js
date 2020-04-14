const { body, validationResult } = require('express-validator/check')
const ActivityModel = require('../lib/activities')

// 添加验证
exports.actCreatePost = [
  body('name', 'Activity name required').isLength({ min: 1, max: 20 }).trim(),
  body('location', 'location is required'),
  body('limitedOfStu', 'limitedOfStu is required'),
  body('detail', 'detail is required'),
  body('startTime', ' startTime is required'),
  body('endTime', 'EndTime is required'),
  body('enroDeadLine', 'enroDeadLine is required'),
  body('module', 'module is required'),
  (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      res.send(error)
    }
    console.log(req.body)
    // res.send(req.body)

    const startTime = new Date(req.body.startTime)
    const endTime = new Date(req.body.endTime)
    req.body.startTime = startTime
    req.body.endTime = endTime
    req.body.constitutor = req.session.name
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
  const query = req.body
  console.log(query)
  ActivityModel.find(
    { enroDeadLine: { $gte: Date.now() } },
    null,
    (err, resu) => {
      if (err) console.log(err)
      console.log(resu)
      res.send(resu)
    }
  )
}

exports.actDelete = (req, res) => {
  const query = req.body
  console.log('daue')
  console.log(query)
  ActivityModel.deleteOne(
    query,
    (err, resu) => {
      console.log(resu)
      if (err) {
        console.log(err)
        res.err(err)
        return
      }
      if (resu.ok === 1 && resu.deletedCount === 0) {
        res.send('没有需要删除的活动')
      }
      if (resu.ok === 1 && resu.deletedCount === 1) {
        console.log(resu)
        res.send('删除成功')
      }
    }
  )
}

exports.getEnroAct = (req, res) => {
  const constitutor = req.session.name
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
