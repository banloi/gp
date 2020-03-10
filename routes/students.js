module.exports = function (app, Model) {
  app.post('/student', (req, res) => {
    console.log(req.query)
    const student = {
      name: req.query.name,
      number: req.query.number,
      class: req.query.class,
      grade: req.query.grade,
      school: req.query.school
    }
    Model.create(student, function (err, student) {
      if (err) {
        res.send('cannot create a student')
        console.log('create a new student error')
        return
      }
      res.send(student)
    })
  })

  app.get('/student', (req, res) => {
    const query = req.query
    // console.log(req)
    console.log(query)
    Model.find(
      query,
      null,
      function (err, resu) {
        if (err) {
          console.log(err)
        }
        /*         const result = []
        resu.forEach(element => {
          const obj = JSON.parse(JSON.stringify(element))
          const school = element.school
          const grade = element.grade
          obj.school = school
          obj.grade = grade
          result.push(obj)
        })
        console.log(result)
        if (result.length > 0) {
          res.send(result)
        } else {
          res.send('查询结果为空，请检查后重试')
        } */
        if (resu.length > 0) {
          res.send(resu)
        } else {
          res.send('查询结果为空，请检查后重试')
        }
      }
    )
  })
  app.delete('/student', (req, res) => {
    const query = req.query
    Model.remove(
      query,
      function (err, resu) {
        if (err) {
          console.log(err)
        }
        console.log(resu)
        console.log('删除成功')
      }
    )
    res.send('已删除')
  })
  app.patch('/student/:number', (req, res) => {
    const query = req.query
    console.log(req.params)
    Model.updateOne(req.params, query, { new: true }, function (err, docs) {
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
  })
}
