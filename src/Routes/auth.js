const express = require("express");
const { isValidCredentials, isValidAdminCredentials } = require("../utils/isValidAdmin");
const Admin = require("../Database/adminSchema");
const { generateHash, isValidPassword, adminAuth, sentOTP, userAuth } = require("../utils/reusableFunctions");
const jwt = require("jsonwebtoken");
const { emailRegex } = require("../utils/constants");
const bcrypt = require("bcrypt");
const User = require("../Database/userSchema");

const authRouter = express.Router();

// authRouter.post("signup", async (req, res) =>{
//     try {
//         const {fristName, lastName, email, password} = req.body;

//     } catch (error) {
//         res.status(400).json(error.message)
//     }
// })

authRouter.post("/signup/admin", async (req, res) => {
    try {
        const { fristName, lastName, email, password } = req.body;
        if (!fristName || !lastName || !email || !password) {
            throw new Error("Required fields should not be empty...!")
        }
        if (!isValidAdminCredentials(req.body)) {
            throw new Error("Invalid details");
        }

        const passwordHash = await generateHash(password);

        const admin = new Admin({
            fristName,
            lastName,
            email,
            password: passwordHash
        });

        const isAlreadySignup = await Admin.findOne({ email });
        if (isAlreadySignup) {
            throw new Error("Already admin please login..!")
        }

        const validAdmin = await admin.save();
        res.status(200).json(validAdmin);
    } catch (error) {
        res.status(404).json(error.message)
    }
})

authRouter.post("/login/admin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw new Error("Please enter email.!!");
        }

        if (!password) {
            throw new Error("Please enter password.!!");
        }

        if (!isValidCredentials(req.body)) {
            throw new Error("Invalid credentials..!")
        }

        const isValidAdmin = await Admin.findOne({ email });

        if (!isValidAdmin) {
            throw new Error("Not a valid admin..!")
        }

        const passwordValid = await isValidPassword(password, isValidAdmin.password);

        if (!passwordValid) {
            throw new Error("Invalid admin creadentials..!");
        }

        const token = await jwt.sign({ _id: isValidAdmin._id }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.status(200).json(isValidAdmin)

    } catch (error) {
        res.status(400).json(error.message)
    }
})

authRouter.get("/profile/admin", adminAuth, async (req, res) => {
    try {
        const admin = req.admin;
        const { _id } = admin;
        const adminPro = await Admin.findOne({ _id });

        if (!adminPro) {
            throw new Error("admin not found..!");
        }

        res.status(200).send(adminPro);

    } catch (error) {
        res.status(400).json(error.message);
    }
})

authRouter.post("/logout/admin", adminAuth, async (req, res) => {
    try {
        const { _id } = req.admin;
        if (!_id) {
            throw new Error("Logout not possible")
        }

        res.cookie("token", " ", { expires: new Date(0) })
        res.status(200).json("logout successfully.!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

authRouter.post("/signup/user", async (req, res) => {
    try {
        const { fristName, lastName, email, password, photoURL } = req.body;

        if (!fristName || !lastName || !email || !password) {
            throw new Error("Mandatory fields must required..!")
        };

        if (!isValidAdminCredentials(req.body)) {
            throw new Error("Invalid user Data.!")
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            fristName,
            lastName,
            email,
            password: passwordHash,
            photoURL
        })

        const savedUser = await user.save();
        res.status(200).json(savedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

authRouter.post("/login/user/otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error("Email must required for user login");
        }

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address..!")
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found.!")
        }
        
        const currentTimeStamp = new Date().getTime() / 1000;

        if (user.otp && user.otpExpiry && user.otpExpiry > currentTimeStamp) {
            throw new Error(`OTP already sent to ${email} please check it.`)
        }

        const otp = parseInt(Math.floor(Math.random() * 100000));
        const otpExpiry = currentTimeStamp + 120;

        await sentOTP(email, otp);

        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, {
            $set: { otp: otp, otpExpiry: otpExpiry }
        }, { returnDocument: "after" }).select("email fristName lastName otpExpiry")

        res.status(200).json(updatedUser, { message: "OTP sent successfully.!" })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

authRouter.post("/login/user/otp/resend", async (req, res) => {
    try {
        const { email } = req.body;


        if (!email) {
            throw new Error("Invalid credentials.!")
        }

        const validUser = await User.findOne({ email: email });

        if (!validUser) {
            throw new Error("Invalid credentials.!")
        }

        const currentTimeStamp = new Date().getTime() / 1000;

        if (validUser.otpExpiry > currentTimeStamp) {
            throw new Error("OTP already sent.!")
        }

        const otp = Math.floor(Math.random() * 100000);
        const otpExpiry = currentTimeStamp + 120;

        await sentOTP(email, otp);

        const updatedUser = await User.findOneAndUpdate({ _id: validUser._id }, {
            $set: { otp, otpExpiry }
        }, { new: true }).select("email fristName lastName otpExpiry")
            console.log(updatedUser)
        res.status(202).json(updatedUser, {message: "Otp resend successfully" })

    } catch (error) {
        res.status(200).json({ message: error.message })
    }
})

authRouter.post("/login/user/otp/verify", async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new Error("Invalid otp!")
        }

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email.!")
        }

        const user = await User.findOne({ email })

        if (!user) {
            throw new Error("user not found..!")
        }

        const currentTimeStamp = new Date().getTime() / 1000;

        if (user && user.otpExpiry && user.otpExpiry < currentTimeStamp) {
            throw new Error("OTP got expired..!")
        }
        if (user.otp !== otp) {
            throw new Error("Invalid OTP..!")
        }

        const token = await jwt.sign({ email: email, _id: user._id }, process.env.JWT_KEY, { expiresIn: 3600 });

        res.cookie("token", token)

        const unsetOTPDetails = await User.findOneAndUpdate({ email: user.email }, {
            $unset: { otp: "", otpExpiry: "" }
        })

        res.status(200).json({
            message: "OTP verified",
            user,
        })

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})

authRouter.post("/logout/user", async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token got expired.!")
        }
        res.cookie('token', token, { expires: new Date(0) })
        res.status(200).json("logout successfully.!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

authRouter.get("/profile/user/get", userAuth, async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
})

module.exports = authRouter;