const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../Database/adminSchema");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("../Database/userSchema");

dotenv.config();

const generateHash = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
}

const isValidPassword = async (password, passwordHash) => {
    const validPassword = await bcrypt.compare(password, passwordHash);
    return validPassword;
}

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token got expired..!");
        };

        const isTokenValid = await jwt.verify(token, process.env.JWT_KEY);

        if (!isTokenValid) {
            throw new Error("Token is not valid.!");
        };

        const { _id } = isTokenValid;

        const isAdmin = await Admin.findOne({ _id: _id });

        if (!isAdmin) {
            throw new Error("Admin not found...!");
        };

        req.admin = isAdmin;
        next();
    } catch (error) {
        res.status(404).json(error.message)
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSKEY,
    }
})

const sentOTP = async (email, otp) => {

    await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: email,
        subject: "OTP for user authentication or user login.",
        html: `
    <p>This otp will expire in 10min</p>
    <h2>${otp}</h2>
    `
    })

}

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token got expired.!")
        }

        const isValidToken = await jwt.verify(token, process.env.JWT_KEY);

        if (!isValidToken) {
            throw new Error("Invalid token.!")
        }

        const user = await User.find({ email: isValidToken.email }).select("fristName lastName photoURL");
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

const transporter2 = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.ADMIN_PASSKEY,
    }
})

const sendMailToAdmin = async (props) => {
    const { name, email, phoneNumber, message } = props;
    await transporter2.sendMail({
        from: email,
        to: process.env.ADMIN_MAIL,
        subject: "New Contact Query from ISP Website",
        html: `
        <h3>Message from new user customer</h3>
        <p>${name}</p>
        <p>${email}</p>
        <p>${phoneNumber || "No number"}</p>
        <p>${message}</p>
        `
    })
}

module.exports = {
    generateHash,
    isValidPassword,
    adminAuth,
    sentOTP,
    userAuth,
    sendMailToAdmin,
}