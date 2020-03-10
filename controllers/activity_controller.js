const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

exports.actCreatePost = [
  body('name', 'Activity name required').isLength({ min: 1, max: 20 }).trim(),
  body('location', 'location is required'),
  body('limitedOfStu', 'limitedOfStu is required'),
  body('detail', 'detail is required'),
  body('startTime', ' startTime is required'),
  body('endTime', 'EndTime is required'),
  body('constitutor', 'constitutor is required'),
  body('module', 'module is required'),
  (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      res.send(error)
    }
    console.log(req.body)
  }
]
