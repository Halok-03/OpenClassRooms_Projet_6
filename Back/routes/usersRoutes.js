const express = require ('express') 
const router = express.Router()
const usersControllers = require('../controllers/usersControllers')

router.post('/signup', usersControllers.signup)
router.post('/login', usersControllers.login)

module.exports = router