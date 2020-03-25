const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
// const path = require('path')
const mongoose = require('mongoose')
const config = require('config-lite')(__dirname)

mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.promise = global.promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// __dirname 表示执行文件所在目录的完整目录名
/* app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './1.html'))
  res.setHeader('Content-Type', 'text/html')
})
 */

// 用户注册路由
const userRouter = require('./routers/user')
app.use('/user', userRouter)

// 管理员路由
const admRouter = require('./routers/adm')
app.use('/adm', admRouter)

// 活动路由
const activityRouter = require('./routers/activities')
app.use('/activity', activityRouter)

// 学生路由
const studentRouter = require('./routers/students')
app.use('student', studentRouter)

// 报名表路由
const enrollmentRouter = require('./routers/enrollment')
app.use('/enrollment', enrollmentRouter)

// 得分路由
const scoreRouter = require('./routers/score')
app.use('/score', scoreRouter)

app.listen(3000, () => {
  console.log('Listening 3000')
})
