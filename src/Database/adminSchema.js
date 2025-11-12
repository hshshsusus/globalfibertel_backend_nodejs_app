const mongoose = require("mongoose");

const adminShema = new mongoose.Schema({
    fristName: {
        type: String,
        requied: true,
        minLength: 4,
        maxLength: 35,
        trim: true
    },
    lastName: {
        type: String,
        requied: true,
        minLength: 4,
        maxLength: 35,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => {
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                    throw new Error("emain is not valid..")
                }
            }
        }
    },
    password: {
        type: String,
        requied: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
},
    {
        timestamps: true
    })

const Admin = new mongoose.model("Admin", adminShema);

module.exports = Admin;