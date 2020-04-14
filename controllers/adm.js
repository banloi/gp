const AdmModel = require('../lib/adm')

exports.admLogin = (req, res) => {
  let type = ''
  function findAdm (name, password) {
    console.log('调用findUser')
    return new Promise((resolve, reject) => {
      AdmModel.findOne(
        { name: name },
        null)
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
              type = resu.type
              if (password === resu.password) {
                console.log('可登录')
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
    req.session.name = name
    res.status(200).json({ message: '登录成功', type: type })
  }

  function rejected (err) {
    req.session.name = ''
    res.status(400).json({ Error: err.message })
  }

  console.log('hahah')
  const { name, password } = req.body

  findAdm(name, password)
    .then(authed, (err) => { rejected(err) })
    .catch(e => console.log(e.message))
}

exports.admRegister = (req, res) => {
  // 查找用户
  const name = req.body.name
  function findAdm () {
    console.log('调用findUser')
    return new Promise((resolve, reject) => {
      AdmModel.findOne(
        { name: name },
        null,
        (err, resu) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          if (resu === null) {
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

  function createAdm () {
    const name = req.body.name
    const password = req.body.password
    const type = req.body.type
    // const telephone = req.body.telephone
    return new Promise((resolve, reject) => {
      AdmModel.create(
        {
          name: name,
          password: password,
          type: type
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
    res.status(201)
      .json({ name: name })
  }
  findAdm()
    .then(createAdm)
    .then(successRes, e => {
      console.log(e.message)
      res.status(200)
        .json({ Error: e.message })
    })
    .catch(e => console.log(e))
}
