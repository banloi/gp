const UserModel = require('../lib/user')
const StudentModel = require('../lib/students')
const EnrollmentModel = require('../lib/enrollment')
const ScoreModel = require('../lib/score')
const ActivityModel = require('../lib/activities')

function findStu (number) {
  console.log('调用findStu')
  return new Promise((resolve, reject) => {
    StudentModel.find(
      { number: number },
      null,
      (err, resu) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        if (resu.length === 0) {
          console.log('不存在该学生')
          reject(new Error('不存在该学生'))
        } else {
          console.log('找到学生')
          resolve()
        }
      }
    )
  })
}

exports.userRegister = (req, res) => {
  console.log('nidaye', req.session.number)
  const number = req.body.number
  function findStu () {
    console.log('调用findStu')
    return new Promise((resolve, reject) => {
      StudentModel.find(
        { number: req.body.number },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          if (resu.length === 0) {
            console.log('不存在该学生')
            reject(new Error('不存在该学生'))
          } else {
            console.log('找到学生')
            resolve()
          }
        }
      )
    })
  }

  // 查找用户
  function findUser () {
    console.log('调用findUser')
    return new Promise((resolve, reject) => {
      UserModel.find(
        { number: req.body.number },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          if (resu.length === 0) {
            console.log('不存在该用户')
            resolve()
          } else {
            console.log('找到用户')
            reject(new Error('该用户已注册，请直接登录'))
          }
        }
      )
    })
  }

  function createUser () {
    console.log('hahahahahha')
    return new Promise((resolve, reject) => {
      UserModel.create(
        req.body,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(resu)

            resolve()
          }
        }
      )
    })
  }
  function successRes () {
    res.status(201)
      .json({ number: number })
  }
  findStu()
    .then(findUser)
    .then(createUser)
    .then(successRes, e => {
      req.session.number = req.body.number // 设置 session
      console.log(e.message)
      res.status(200)
        .json({ Error: e.message })
    })
    .catch(e => console.log(e))
  // Promise.all([findStu(), findUser()]).then(createUser, err => console.log(err))
  console.log(req.body)
  console.log(req.session)
}

exports.userLogin = (req, res) => {
  // 查找用户
  function findUser (number, password) {
    console.log('调用findUser')
    return new Promise((resolve, reject) => {
      UserModel.findOne(
        { number: number },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(resu)
            if (resu === null) { // findOne 没有找到结果的时候会返回 null
              console.log('不存在该用户')
              reject(new Error('账号或密码错误'))
            } else {
              console.log(resu)
              console.log('找到用户')
              if (password === resu.password) {
                console.log('可登录')
                resolve()
              } else {
                reject(new Error('账号或密码错误'))
                console.log('账号或密码错误')
              }
            }
          }
        }
      )
    })
  }

  function authed () {
    req.session.number = number
    res.status(200).json({ message: '登录成功' })
  }

  function rejected (err) {
    req.session.number = ''
    res.status(400).json({ Error: err.message })
  }

  console.log('hahah')
  const { number, password } = req.body

  findUser(number, password)
    .then(authed, (err) => { rejected(err) })
    .catch(e => console.log(e.message))

  console.log(req.body)
  console.log(number)
  console.log(password)
}

exports.getUserActivity = (req, res) => {
  const number = req.session.number
  const list = {}
  // 查找已报名的项目
  function findEnro () {
    return new Promise((resolve, reject) => {
      EnrollmentModel.find(
        { studentNumber: number },
        '_id'
      )
        // .populate({ path: 'studentInfo', model: StudentModel })
        .populate({ path: 'activityInfo', model: ActivityModel })
        .exec((err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            list.enro = resu
            resolve(resu)
          }
        })
    })
  }
  // 查找已达分的项目
  function findScore () {
    return new Promise((resolve, reject) => {
      ScoreModel.find(
        { studentNumber: number },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            list.score = resu
            resolve(resu)
          }
        }
      )
    })
  }
  function cl () {
    res.status(200)
      .json(list)
  }

  if (req.session.number === undefined || req.session.number === '') {
    res.status(400)
      .json({ Error: '请先登录 ' })
  } else {
    findEnro()
      .then(findScore)
      .then(cl)
      .catch(e => { console.log(e) })
    console.log(req.session.number)
  }
}
