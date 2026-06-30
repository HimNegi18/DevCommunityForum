const express = require('express')
const router = express.Router()
const {authRegistration, authLogin} = require('../controllers/authController')

router.post('/registration',authRegistration)
router.post('/login',authLogin)

module.exports = router