const StudentModel = require('../lib/students')
const xlsx = require('xlsx')

// const upload = multer({ storage: multer.memoryStorage() })

exports.createStudent = (req, res) => {
  console.log(req.body)
  const list = []
  for (const key in req.body) {
    const element = req.body[key]
    list.push(element)
  }
  console.log(list)
  StudentModel.insertMany(
    list,
    {
      ordered: false
    },
    function (err, student) {
      if (err) {
        console.log(err)
        console.log(err.result)
        if (err.message.match('duplicate key')) {
          console.log(err.message)
        }
      }
      console.log('haha', student)
      res.json(student)
    })
}

exports.findStudent = (req, res) => {
  const query = req.query
  console.log(query)
  const item = {}
  if (query['0']) {
    item._id = query['0']
    console.log(query)
  }
  StudentModel.find(
    item,
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
  const { _id, ...info } = req.body
  console.log(req.body)
  StudentModel.updateOne(
    { _id: _id }, info,
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
        res.status(400).json({ Error: '未查询到该学生信息' })
      }
      if (docs.n === 1 && docs.nModified === 1) {
        res.json({ message: '修改完成' })
      }
      if (docs.n === 1 && docs.nModified === 0) {
        res.status(400).json({ Error: '未修改，请检查提交的修改内容后重试' })
      }
      console.log(docs)
    })
}

exports.deleteStudent = (req, res) => {
  const _id = req.query._id
  StudentModel.deleteOne(
    { _id: _id },
    (err, resu) => {
      if (err) {
        console.log(err)
        res.status(400).json({ Error: '删除失败' })
      } else {
        console.log(resu)
        res.json({ message: '删除完成' })
      }
    }
  )
}

exports.getFile = (req, res) => {
  console.log(req.files)
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ Error: '请选择文件上传' })
  }

  const { originalname, buffer } = req.files[0]
  if (!originalname.endsWith('xls') && !originalname.endsWith('xlsx')) {
    return res.status(400).json({ Error: '请上传xls或xlsx格式的文件' })
  }
  // 解析excel文件
  const workbook = xlsx.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]] // 选择第一个工作簿
  const result = xlsx.utils.sheet_to_json(sheet)

  return res.json(result)
}
