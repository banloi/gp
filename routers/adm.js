const admController = require('../controllers/adm')
const express = require('express')
const router = express.Router()

router.post('/', admController.admRegister)
router.post('/login', admController.admLogin)

module.exports = router
