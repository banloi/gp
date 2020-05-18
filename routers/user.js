const userController = require('../controllers/user')
const express = require('express')
const router = express.Router()
const check = require('../controllers/check')

router.post('/', userController.userRegister)
router.post('/login', userController.userLogin)
router.get('/userinfo', check.checkLogin, userController.getUserInfo)
router.get('/activities/done', check.checkLogin, userController.getDoneActivities)
router.get('/activities/enrolled', check.checkLogin, userController.getEnrolledActivities)

module.exports = router
