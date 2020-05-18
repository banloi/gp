const express = require('express')
const router = express.Router()
const enrollmentCtroller = require('../controllers/enrollment')
const check = require('../controllers/check')

router.get('/', check.checkAdmLogin, enrollmentCtroller.findEnrollment)
router.post('/', check.checkLogin, enrollmentCtroller.createEnrollment)
router.post('/adm', check.checkAdmLogin, enrollmentCtroller.createEnrollment)
router.put('/')
router.post('/cancel', /*  check.checkLogin, */ enrollmentCtroller.deleteEnrollment)

module.exports = router
