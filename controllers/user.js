const UserModel = require('../lib/user')
const StudentModel = require('../lib/students')
const EnrollmentModel = require('../lib/enrollment')
const ScoreModel = require('../lib/score')
const ActivityModel = require('../lib/activities')
const check = require('./check')

exports.userRegister = (req, res) => {
  let studentInfo = ''
  const number = req.body.number
  function findStu () {
    console.log('调用findStu')
    return new Promise((resolve, reject) => {
      StudentModel.findOne(
        { number: number },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          if (resu === null) {
            console.log('不存在该学生')
            reject(new Error('不存在该学生'))
          } else {
            studentInfo = resu._id
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
        { number: number },
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
    const number = req.body.number
    const password = req.body.password
    const telephone = req.body.telephone
    console.log(studentInfo)
    return new Promise((resolve, reject) => {
      UserModel.create(
        {
          number: number,
          password: password,
          telephone: telephone,
          studentInfo: studentInfo
        },
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
    const token = check.jwtSign({ number: number })
    res.status(201).json({ message: '注册成功', type: 'user', token: token })
  }
  findStu()
    .then(findUser)
    .then(createUser)
    .then(successRes, e => {
      // req.session.number = req.body.number // 设置 session
      console.log(e.message)
      res.status(400)
        .json({ Error: e.message })
    })
    .catch(e => console.log(e))
  // Promise.all([findStu(), findUser()]).then(createUser, err => console.log(err))
  console.log(req.body)
}

exports.userLogin = (req, res) => {
  // 查找用户
  let studentInfo = {}
  function findUser (number, password) {
    console.log('调用findUser')
    return new Promise((resolve, reject) => {
      UserModel.findOne(
        { number: number },
        null)
        .populate({ path: 'studentInfo', model: StudentModel })
        .exec((err, resu) => {
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
                studentInfo = resu.studentInfo
                resolve()
              } else {
                reject(new Error('账号或密码错误'))
                console.log('账号或密码错误')
              }
            }
          }
        })
    })
  }

  function authed () {
    const token = check.jwtSign({
      number: number
    })
    console.log(token)
    res.status(200).json({ message: '登录成功', studentInfo: studentInfo, type: 'user', token: token })
  }

  function rejected (err) {
    res.status(401).json({ Error: err.message })
  }

  console.log('hahah')
  const { password } = req.body
  const number = req.body.username
  console.log(req.body)

  findUser(number, password)
    .then(authed, (err) => { rejected(err) })
    .catch(e => console.log(e.message))
}

exports.getEnrolledActivities = (req, res) => {
  let list
  const number = req.jwtInfo.number
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
            list = resu // 获取已经报名的活动
            console.log(resu)
            resolve(resu)
          }
        })
    })
  }
  function cl () {
    console.log(list)
    res.status(200) // 返回活动列表
      .json(list)
  }
  console.log('已报名')
  console.log(list)
  findEnro()
    .then(cl)
    .catch(e => { console.log(e) })
}

exports.getDoneActivities = (req, res) => {
  let list

  const number = req.jwtInfo.number
  console.log(number)
  function findScore () {
    return new Promise((resolve, reject) => {
      ScoreModel.find(
        { studentNumber: number },
        null
      )
        .populate({ path: 'activityInfo', model: ActivityModel })
        .exec((err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            list = resu // 获取已打分活动
            resolve(resu)
          }
        })
    })
  }

  function cl () {
    res.status(200) // 返回活动列表
      .json(list)
  }
  console.log('完成')

  findScore()
    .then(cl)
    .catch(e => { console.log(e) })
}

exports.getUserInfo = (req, res) => {
  const number = req.jwtInfo.number
  const list = {}
  // 查找已报名的项目

  function getScore () {
    return new Promise((resolve, reject) => {
      ScoreModel.find(
        { studentNumber: number },
        'score performance'
      )
        .populate({ path: 'activityInfo', model: ActivityModel })
        .exec((err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            list.score = resu // 获取已打分活动
            resolve(resu)
          }
        })
    })
  }

  function getTel () {
    return new Promise((resolve, reject) => {
      UserModel.findOne(
        { number: number },
        'telephone',
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            list.telephone = resu.telephone
            resolve()
          }
        }
      )
    })
  }

  function getStudentInfo () {
    return new Promise((resolve, reject) => {
      StudentModel.findOne(
        { number: number },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            list.info = resu
            resolve()
          }
        }
      )
    })
  }

  function cl () {
    res.status(200) // 返回活动列表
      .json(list)
  }

  getStudentInfo()
    .then(getScore)
    .then(getTel)
    .then(cl)
    .catch(e => { console.log(e) })
  console.log(req.jwtInfo.number)
}
