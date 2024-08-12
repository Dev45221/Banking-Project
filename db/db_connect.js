const mongoose = require('mongoose');

const DB_Connect = async (DB_NAME,DB_URL)=>{
    try {
        let DB_OPTIONS = {
            dbName:DB_NAME
        }
        await mongoose.connect(DB_URL,DB_OPTIONS)
        console.log("Database Connection Successfully Done !!!")
    } catch (error) {
        console.log("Database Connection Error:",error)
    }
}
module.exports = DB_Connect