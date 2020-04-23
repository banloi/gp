const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/score')
const check = require('../controllers/check')

router.get('/', scoreController.getScore) // 获取分数
router.get('/ratelist', check.checkAdmLogin, scoreController.getRateList) // 获取打分列表
router.put('/')
router.post('/', check.checkAdmLogin, scoreController.createScore) // 创建分数
router.delete('/')

module.exports = router
