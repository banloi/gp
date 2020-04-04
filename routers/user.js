const userController = require('../controllers/user')
const express = require('express')
const router = express.Router()

router.post('/', userController.userRegister)
router.post('/login', userController.userLogin)
router.get('/activities', userController.getUserActivity)

module.exports = router
