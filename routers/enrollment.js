const express = require('express')
const router = express.Router()
const enrollmentCtroller = require('../controllers/enrollment')

router.get('/', enrollmentCtroller.findEnrollemt)
router.post('/', enrollmentCtroller.createEnrollment)
router.put('/')
router.delete('/', enrollmentCtroller.deleteEnrollment)

module.exports = router
