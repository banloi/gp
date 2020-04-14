module.exports = {
  checkLogin: function checkLogin (req, res, next) {
    if (req.session.number === undefined || req.session.number === '') {
      res.status(400).json({ Error: '请先登录' })
      return
    }
    next()
  },

  checkNotLogin: function checkNotLogin (req, res, next) {
    if (req.session.number) {
      req.flash('error', '已登录')
      return res.redirect('back')// 返回之前的页面
    }
    next()
  },

  checkAdmLogin: function checkAdmLogin (req, res, next) {
    if (req.session.name === undefined || req.session.name === '') {
      res.status(400).json({ Error: '请先登录' })
      return
    }
    next()
  }
}
