const dotenv = require('dotenv');
dotenv.config({path:"./config/config.env"})

var nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, //admin email
        pass: process.env.EMAIL_PASS  //admin pass
    }
});
module.exports = transporter
