const admController = require('../controllers/adm')
const express = require('express')
const router = express.Router()
const check = require('../controllers/check')

router.post('/', admController.admRegister)
router.post('/login', admController.admLogin)
router.put('/password', check.checkAdmLogin, admController.putPassword)
module.exports = router
