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

const studentModel = require('./lib/students')
const activityModel = require('./lib/activities')

// __dirname 表示执行文件所在目录的完整目录名
/* app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './1.html'))
  res.setHeader('Content-Type', 'text/html')
})
 */

require('./routes/students')(app, studentModel)
require('./routes/activities')(app, activityModel)

app.listen(3000, () => {
  console.log('Listening 3000')
})
