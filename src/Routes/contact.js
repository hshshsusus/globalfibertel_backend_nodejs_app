const express = require("express");
const { emailRegex } = require("../utils/constants");
const connection = require("../Database_SQL/connectDB");
const { sendMailToAdmin } = require("../utils/reusableFunctions");

const contactRouter = express.Router();

contactRouter.post("/user/contact/sent/message", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        let {phoneNumber} = req.body;

        if (!name || !email || !message) {
            throw new Error("All fields are must required.!")
        }

        if (name.length < 4 || name.length > 100) {
            throw new Error("Name of the characters must be in 4 t0 100");
        }

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address.!")
        }

        if (message.length < 4 || message.length > 255) {
            throw new Error("Message must be in between from 4 to 255 characters.!")
        }

        if (phoneNumber && phoneNumber.length !== 10) {
            console.log(phoneNumber)
            throw new Error("Invalid mobile number.!")
        }
        if(phoneNumber === ""){
            phoneNumber=null;
        }
        const res1 = await connection.promise().query("insert into contactUs(name, email, phoneNumber, message) values(?, ?, ? ,?)", [name, email, phoneNumber, message]);

        const email1 = await sendMailToAdmin({ name, email, phoneNumber, message });
        // console.log(email1)
        res.status(200).json("Message sent successfully.!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = contactRouter;