const mongoose = require('mongoose');

async function connectDB(dbUrl){
    try {
        await mongoose.connect(`${dbUrl}`);
        console.log(`${dbUrl}`);
        console.log("Connected to DB.")
    } catch (error) {
        console.log("Error: ", error)
    }
}



module.exports = {
    connectDB,

}