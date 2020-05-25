const StudentControllers = require('../controllers/student')
const experss = require('express')
const router = experss.Router()
const multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.post('/', StudentControllers.createStudent)
router.get('/', StudentControllers.findStudent)
router.put('/', StudentControllers.modifyStudent)
router.post('/excel', upload.any(), StudentControllers.getFile)
router.delete('/', StudentControllers.deleteStudent)

module.exports = router
