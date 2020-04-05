const StudentModel = require('../lib/students')

exports.createStudent = (req, res) => {
  console.log(req.body)
  console.log(req.session.name)
  StudentModel.create(
    req.body,
    function (err, student) {
      if (err) {
        if (err.message.match('duplicate key')) {
          req.flash('error', '用户名已被占用')
          return res.redirect('/signup')
        }
        next(err)
      }
      res
        .cookie(
          'hahah', 'asda',
          {
            maxAge: 10 * 1000, path: '/', httpOnly: true
          }
        )
        .send(student)
      req.session.user = student
      req.flash('success', '注册成功')
    })
}

exports.findStudent = (req, res) => {
  const query = req.body
  // console.log(req)
  console.log(query)
  StudentModel.find(
    query,
    null,
    function (err, resu) {
      if (err) {
        console.log(err)
      }
      if (resu.length > 0) {
        res.send(resu)
      } else {
        res.send('查询结果为空，请检查后重试')
      }
    }
  )
}

exports.modifyStudent = (req, res) => {
  const query = req.body
  console.log(req.params)
  StudentModel.updateOne(
    req.params, query,
    { new: true },
    function (err, docs) {
      if (err) {
        console.log(err)
        res.send(err)
      }
      if (docs.ok === 0) {
      // res.send('已存在学号' + number)
        console.log(docs)
        return
      }
      if (docs.n === 0) {
        res.send('未查询到该学生信息')
      }
      if (docs.n === 1 && docs.nModified === 1) {
        res.send('修改完成')
      }
      if (docs.n === 1 && docs.nModified === 0) {
        res.send('未修改，请检查提交的修改内容后重试')
      }
      console.log(docs)
    })
}
const path = require('path')
exports.god = (req, res) => {
  res
    .cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
    .sendFile(path.join(__dirname, '../views/1.html'))
}
