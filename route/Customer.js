const express = require('express');
const customerController = require('../controller/CustomerController')
const multipleimgupload = require('../modals/multipleimgupload')
const authMiddleware = require('../middleware/auth-middleware')
const imgUpload = require('../modals/ImgUpload')
var router = express.Router()


//middleware
// router.use(authMiddleware)

//routing
router.put('/editprofile', customerController.editProfile)
router.put("/withdraw",customerController.withdrawAmt)
router.put("/deposit",customerController.depositAmt)
router.get("/transactions",customerController.fetchTransaction)
router.post('/uploaddocument',imgUpload.single("upload_doc"),customerController.uploadDocument)
router.post('/uploadmultiple',multipleimgupload.array("upload_doc",12),customerController.multipleUploadDocument)
router.get('/details',customerController.fetchSingleCustomer)
router.get('/fetchmultipledoc',customerController.fetchCustomerDocuments)

router.post('/fixeddeposit',customerController.createFD)
router.post('/updatebalance',customerController.updateBalance)
router.post('/changepassword',customerController.changePassword)
router.get('/fetchfd',customerController.fetchFD)
router.post('/verifyUser', customerController.verifyUser)
router.put('/setPassword', customerController.setPassword)
module.exports = router
