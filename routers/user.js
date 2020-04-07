const userController = require('../controllers/user')
const express = require('express')
const router = express.Router()
const check = require('../controllers/check')

router.post('/', userController.userRegister)
router.post('/login', userController.userLogin)
router.get('/activities', check.checkLogin, userController.getUserInfo)

module.exports = router
