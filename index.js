const express = require('express')
const bodyParser = require('body-parser')
const cookieParse = require('cookie-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
// const path = require('path')
const mongoose = require('mongoose')
const config = require('config-lite')(__dirname)
const flash = require('connect-flash')

mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.promise = global.promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// 跨域问题
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.use(cookieParse())

// 设置 session
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
app.use(session({
  name: config.session.key, // 设置 coolie 中，保存 session 的字段名称，默认为 connect.sid
  secret: config.session.secret, // 通过 secret 字符串，计算 hash 的值，使得产生的 signdCookie 防篡改
  resave: true, // 即使 session 没有被修改，也保存 session 值， 默认 true
  saveUninitialized: false, // 强制未初始化的 session 保存到数据库
  cookie: { // 设置存放 sessionId 的 cookie 的相关选项
    maxAge: config.session.maxAge
  },
  store: new MongoStore({ // session 的存储方式
    url: config.mongoDB
  })
}))

// connect-flash: 基于 session 实现的用于通知功能的中间件，需结合 express-session 使用
app.use(flash())

// __dirname 表示执行文件所在目录的完整目录名
/* app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './1.html'))
  res.setHeader('Content-Type', 'text/html')
})
 */

// app.use('/')

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
app.use('/student', studentRouter)

// 报名表路由
const enrollmentRouter = require('./routers/enrollment')
app.use('/enrollment', enrollmentRouter)

// 得分路由
const scoreRouter = require('./routers/score')
app.use('/score', scoreRouter)

app.listen(3000, () => {
  console.log('Listening 3000')
})
