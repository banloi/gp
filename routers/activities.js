const actCtrller = require('../controllers/activity')
const express = require('express')
const router = express.Router()
const check = require('../controllers/check')

router.get('/', check.checkLogin, actCtrller.actQueryGet)
// POST 请求通常通过表单发送，并返回修改结果，常用于发布消息，新增用户，追加扩展数据库（增）
router.post('/', check.checkAdmLogin, actCtrller.actCreatePost)
// PUT 请求方法使用请求中的负载创建替换目标资源，幂等，一次或多次连续调用是等价的，无副作用（改）
router.put('/complete', check.checkAdmLogin, actCtrller.complete)
router.delete('/', actCtrller.actDelete)

router.get('/enrolling', check.checkAdmLogin, actCtrller.getEnroAct)
router.get('/underway', check.checkAdmLogin, actCtrller.getUnderway)
router.get('/unrated', check.checkAdmLogin, actCtrller.getUnrated)

module.exports = router
