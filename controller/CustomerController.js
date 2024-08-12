const CustomerModal = require('../modals/CustomerModal')
const TransactionModal = require('../modals/transactionmodal');
const DocumentModal = require('../modals/DocumentModal')
const multipleDocumentModal = require('../modals/multipleuploadmodal')
const FDModal = require('../modals/fdmodal')
const dotenv = require('dotenv');
dotenv.config({ path: "./config/config.env" })
const crypto = require('crypto');
const bcrypt = require('bcrypt')

const withdrawAmt = async (req, res) => {
    const { id } = req.query
    console.log(id)
    const { amount, email, accno } = req.body
    try {
        var customer = await CustomerModal.findOne({ email })
        console.log(customer)
        if (customer != null) {
            if (customer.accno === accno) {
                var result = await CustomerModal.findByIdAndUpdate({
                    _id: id
                }, {
                    $set: {
                        accno: accno,
                        balance: customer.balance - amount
                    }
                }, {
                    new: true,
                    useFindAndModify: false
                })
                //transaction logic
                var Transhistory = new TransactionModal({
                    customer_id: id,
                    amount: amount,
                    balance_before_transaction: customer.balance,
                    balance_after_transaction: customer.balance - amount,
                    transaction_type: "withdraw"
                })
                await Transhistory.save()
                return res.status(200).json({
                    status: true,
                    record: result
                })
            } else {
                return res.status(400).json({
                    status: false,
                    msg: "AccNo is InValid"
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                msg: "Email is InValid"
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

const depositAmt = async (req, res) => {
    const { id } = req.query
    console.log(id)
    const { amount, email, accno } = req.body
    try {
        var customer = await CustomerModal.findOne({ email })
        console.log(customer)
        if (customer != null) {
            if (customer.accno === accno) {
                var result = await CustomerModal.findByIdAndUpdate({
                    _id: id
                }, {
                    $set: {
                        accno: accno,
                        balance: customer.balance + parseFloat(amount)
                    }
                }, {
                    new: true,
                    useFindAndModify: false
                })
                //logic
                var Transhistory = new TransactionModal({
                    customer_id: id,
                    amount: amount,
                    balance_before_transaction: customer.balance,
                    balance_after_transaction: customer.balance + parseFloat(amount),
                    transaction_type: "deposit"
                })
                await Transhistory.save()
                return res.status(200).json({
                    status: true,
                    record: result
                })
            } else {
                return res.status(400).json({
                    status: false,
                    msg: "AccNo is InValid"
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                msg: "Email is InValid"
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

const fetchTransaction = async (req, res) => {
    const { id } = req.query
    try {
        var transactions = await TransactionModal.find({ customer_id: id })
        return res.status(200).json({
            status: true,
            transactions: transactions
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

const uploadDocument = async (req, res) => {
    const { id } = req.query
    const { doc_name } = req.body
    const upload_doc = req.file.path
    console.log(doc_name)
    console.log(upload_doc)
    console.log(id)
    try {
        const uploaddata = new DocumentModal({
            doc_name,
            upload_doc: `http://localhost:${process.env.PORTNO}/` + upload_doc,
            customer_id: id
        })
        await uploaddata.save()
        return res.status(200).json({
            success: true,
            post: uploaddata
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            msg: "Image Not Uploaded!!"
        })
    }
}

const multipleUploadDocument = async (req, res) => {
    const { id } = req.query
    const upload_doc = req.files
    // console.log(doc_name)
    // console.log(upload_doc)
    console.log(id)

    var newdoc = upload_doc.map((data) => {
        return {
            type: data.mimetype,
            name: data.filename,
            path: `http://localhost:${process.env.PORTNO}/` +
                data.path,
            size: data.size
        }
    })
    console.log("New Data:", newdoc)
    try {
        var isExist = await multipleDocumentModal.findOne({ customer_id: id })
        console.log(isExist)
        if (isExist) {
            console.log("=============Already exits==========")
            //console.log(isExist["upload_doc"])
            var arr = [...isExist["upload_doc"], ...newdoc]
            console.log("=========Result:", arr)
            isExist["upload_doc"] = arr
            await isExist.save()
            return res.status(200).json({
                success: true,
                post: isExist
            })
        } else {
            const uploaddata = new multipleDocumentModal({
                upload_doc: newdoc,
                customer_id: id
            })
            console.log(uploaddata)
            await uploaddata.save()
            return res.status(200).json({
                success: true,
                post: uploaddata
            })
        }
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
            msg: "Images Not Uploaded!!"
        })
    }
}

const fetchSingleCustomer = async (req, res) => {
    const { id } = req.query
    try {
        var customer = await CustomerModal.findOne({ _id: id })
        return res.status(200).json({
            success: true,
            record: customer
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}

const fetchCustomerDocuments = async (req, res) => {
    const { id } = req.query
    try {
        var docs = await multipleDocumentModal.find({ customer_id: id })
        return res.status(200).json({
            success: true,
            documents: docs
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}

const editProfile = async (req, res) => {
    const { id } = req.query
    const { name, mobile, gender, city, state, pincode } = req.body
    console.log(req.body)
    try {
        const updatedDetails = await CustomerModal.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    name: name,
                    mobile: mobile,
                    address: {
                        city: city,
                        state: state,
                        pincode: pincode
                    },
                    gender: gender,
                }
            }, {
            new: true,
            newFindAndModify: false
        })

        console.log(updatedDetails)
        return res.status(200).json({
            success: true,
            msg: "Customer Record Updated Successfully !",
            record: updatedDetails
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Customer Record Not Updated!",
            Error: error
        })
    }

}

const createFD = async (req, res) => {
    const { id } = req.query
    const { fd_amount, email, fd_duration } = req.body
    try {
        var customer = await CustomerModal.findOne({ email })
        console.log(customer)
        var fd = new FDModal({
            customer_id: id,
            accno: crypto.randomInt(1000000, 9999999),
            fd_amount: fd_amount,
            balance_after_creating_fd: customer.balance - fd_amount,
            fd_duration: fd_duration,
            interestAmount: ((fd_amount * 7.1) / 100) * fd_duration
        })
        await CustomerModal.findByIdAndUpdate({ _id: id }, {
            $set: {
                balance: customer.balance - fd_amount
            }
        },
            { new: true, newFindAndModify: false })
        console.log(fd)
        await fd.save()
        return res.status(200).json({
            status: true,
            fd_record: fd,
            msg: "Successfully Created Fixed Deposit"
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

const updateBalance = async (req, res) => {
    const { id } = req.query
    const { dateInString, accno } = req.body
    var fdcustomer = await FDModal.findOne({ customer_id: id, accno: accno }).populate("customer_id")
    console.log(fdcustomer)
    // console.log(fdcustomer.customer_id.balance)
    setTimeout(async () => {
        const date = new Date(dateInString);
        const newDate = new Date(date.setFullYear(date.getFullYear() + fdcustomer.fd_duration));
        console.log(newDate.toString())

        var result = await CustomerModal.findByIdAndUpdate({ _id: id }, {
            $set: {
                balance: fdcustomer.customer_id.balance + fdcustomer.interestAmount + fdcustomer.fd_amount
            }
        }, { new: true, useFindAndModify: false })
        return res.status(200).json({
            status: true,
            record: result
        })
    }, 0)
}

const changePassword = async (req, res) => {
    const { id } = req.query
    const { oldPass, newPass, conPass } = req.body
    try {
        // console.log(id)
        // console.log(oldPass, newPass, conPass)
        const customer = await CustomerModal.findById(id)
        // console.log(customer)
        const oldHashPass = customer.password
        const checkPass = await bcrypt.compare(oldPass, oldHashPass)
        // console.log(checkPass)

        if (oldPass && newPass && conPass) {
            if (checkPass) {
                if (newPass && conPass) {
                    if (newPass === conPass) {
                        const newHashPass = await bcrypt.hash(newPass, 10)
                        const updatedCustomer = await CustomerModal.findByIdAndUpdate(
                            {
                                _id: customer._id
                            },
                            {
                                $set: {
                                    password: newHashPass
                                }
                            },
                            {
                                new: true,
                                useFindAndModify: false
                            }
                        )
                        console.log(updatedCustomer)
                        console.log("Password changed successfully")
                        return res.status(200).json({
                            status: true,
                            msg: "Password changed successfully",
                            record: customer
                        })
                    } else {
                        return res.status(400).json({
                            status: false,
                            msg: "New password or confirm password doesn't match",
                        })
                    }
                } else {
                    console.log("All fields are required")
                    return res.status(400).json({
                        status: false,
                        msg: "All fields are required",
                    })
                }
            } else {
                return res.status(400).json({
                    status: false,
                    msg: "Old password doesn't match",
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                msg: "All fields are required",
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            msg: "Something went wrong",
            error: error
        })
    }
}

const fetchFD = async (req, res) => {
    const { id } = req.query
    try {
        var fds = await FDModal.find({ customer_id: id })
        return res.status(200).json({
            status: true,
            records: fds
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

const verifyUser = async (req, res) => {
    const { email } = req.body
    try {
        var customer = await CustomerModal.findOne({ email })
        // console.log(customer)
        if (customer != null) {
            return res.status(200).json({
                status: true,
                records: customer
            })
        } else {
            return res.status(400).json({
                status: false,
                msg: "Email not found!"
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

const setPassword = async (req, res) => {
    const { id } = req.query
    const { newPass, conPass } = req.body
    try {
        // console.log(id)
        // console.log(oldPass, newPass, conPass)
        const customer = await CustomerModal.findById(id)
        console.log(customer)

        if (newPass && conPass) {
            if (newPass === conPass) {
                const newHashPass = await bcrypt.hash(newPass, 10)
                const updatedCustomer = await CustomerModal.findByIdAndUpdate(
                    {
                        _id: customer._id
                    },
                    {
                        $set: {
                            password: newHashPass
                        }
                    },
                    {
                        new: true,
                        useFindAndModify: false
                    }
                )
                // console.log(updatedCustomer)
                console.log("Password changed successfully")
                return res.status(200).json({
                    status: true,
                    msg: "Password changed successfully",
                    record: customer
                })
            } else {
                return res.status(400).json({
                    status: false,
                    msg: "New password or confirm password doesn't match",
                })
            }
        } else {
            console.log("All fields are required")
            return res.status(400).json({
                status: false,
                msg: "All fields are required",
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            msg: "Something went wrong",
            error: error
        })
    }
}

module.exports = {
    withdrawAmt,
    depositAmt,
    fetchTransaction,
    uploadDocument,
    multipleUploadDocument,
    editProfile,
    fetchSingleCustomer,
    createFD,
    updateBalance,
    changePassword,
    fetchFD,
    fetchCustomerDocuments,
    verifyUser,
    setPassword
}