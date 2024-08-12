const express = require('express');
const indexController = require('../controller/IndexController')
var router = express.Router()

router.post("/register",indexController.register)
router.post("/login",indexController.login)
router.post('/senduserpasswordresetemail',indexController.sendUserPasswordResetEmail)
router.post('/userpasswordreset',indexController.userPasswordReset)

module.exports = router