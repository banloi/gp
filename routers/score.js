const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/score')

router.get('/', scoreController.getScore) // 获取分数
router.put('/')
router.post('/', scoreController.createScore) // 创建分数
router.delete('/')

module.exports = router
