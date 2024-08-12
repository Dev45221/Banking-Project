const CustomerModal = require('../modals/CustomerModal')
const TransactionModal = require('../modals/transactionmodal');

const getCustomerList = async (req, res) => {
    try {
        var customers = await CustomerModal.find({})
        return res.status(200).json({
            status: true,
            records: customers,
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error,
        })
    }
}

const getCustomer = async (req, res) => {
    console.log(req.query)
    const { id } = req.query
    try {
        var customer = await CustomerModal.findById({ _id: id })
        return res.status(200).json({
            status: true,
            record: customer,
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error,
        })
    }
}

const fetchTransaction = async (req, res) => {
    const { email } = req.body

    var cust = await CustomerModal.findOne({email:email})
    console.log("=======Hello====",cust)
    try {

        var transactions = await TransactionModal.find({ customer_id: cust._id}).populate("customer_id")

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

const manageCustomerStatus = async (req,res) =>{
    const { id, s } = req.query
    console.log("get id:===>", id,s)
    if (s == "block") {
        const result = await CustomerModal.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: 0
            }
        }, {
            new: true,
            useFindAndModify: false
        })
        res.status(200).json({
            success: true,
            msg: result,
        })
    }
    else if (s == "verify") {
        const result = await CustomerModal.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: 1
            }
        }, {
            new: true,
            useFindAndModify: false
        })
        res.status(200).json({
            success: true,
            msg: result,
        })
    }
    else{
        await CustomerModal.findByIdAndDelete({
            _id: id
        },{
            new: true,
            useFindAndModify: false
        })
        res.status(200).json({
            success: true,
            msg: "Record Delete Successfully!!",
        })
    } 
}

module.exports = {
    getCustomerList,
    getCustomer,
    fetchTransaction,
    manageCustomerStatus
}