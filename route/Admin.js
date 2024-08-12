const express = require('express');
const adminController = require('../controller/AdminController')
var router = express.Router()

router.get("/customerlist",adminController.getCustomerList)
router.get("/customer",adminController.getCustomer)
router.post("/transactions",adminController.fetchTransaction)
router.get("/managecustomer",adminController.manageCustomerStatus)
module.exports = router
