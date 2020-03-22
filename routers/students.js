const StudentControllers = require('../controllers/student')
const experss = require('express')
const router = experss.Router()

router.post('/', StudentControllers.createStudent)
router.get('/', StudentControllers.findStudent)
router.patch('/', StudentControllers.modifyStudent)

module.exports = router
