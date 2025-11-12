const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectToDB = async () =>{
    try {
      const res = await mongoose.connect(process.env.DB_URL_STRING+"clone-project2");
    } catch (error) {
        throw new Error(error.message)
    }

}

module.exports = connectToDB;