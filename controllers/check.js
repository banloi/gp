const jwt = require('jsonwebtoken')
const config = require('config-lite')(__dirname)
module.exports = {

  jwtSign: function jwtSign (data) {
    const token = jwt.sign(data, config.jwt.key, { expiresIn: config.jwt.maxAge })
    return token
  },

  checkLogin: function checkLogin (req, res, next) {
    const token = req.headers.authorization
    if (!token) {
      res.status(401).json({ Error: '请先登录' })
      return
    }
    jwt.verify(token, config.jwt.key, (err, data) => {
      if (err || !data.number) {
        console.log(err)
        res.status(401).json({ Error: 'Token 无效' })
      } else if (data.number) {
        req.jwtInfo = data
        console.log(data)
        next()
      }
    })
  },

  checkNotLogin: function checkNotLogin (req, res, next) {
    if (req.session.number) {
      req.flash('error', '已登录')
      return res.redirect('back')// 返回之前的页面
    }
    next()
  },

  checkAdmLogin: function checkAdmLogin (req, res, next) {
    const token = req.headers.authorization
    console.log('nidaye', token)
    if (!token) {
      res.status(401).json({ Error: '请先登录' })
      return
    }
    jwt.verify(token, config.jwt.key, (err, data) => {
      if (err || !data.name) {
        console.log(err)
        res.status(401).json({ Error: 'Token 无效' })
      } else if (data.name) {
        req.jwtInfo = data
        console.log(data)
        next()
      }
    })
  }
}
