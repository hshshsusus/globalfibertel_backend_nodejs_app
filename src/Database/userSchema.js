const mongoose = require("mongoose");
const { emailRegex, passwordRegex } = require("../utils/constants");

const userSchema = new mongoose.Schema({
    fristName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 35,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 35,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                return emailRegex.test(value)
            }
        }
    },
    plan: {
        name: {
            type: String,
        },
        speed: {
            type: String,
        },
        expiry:{
            type:String,
        },
        price:{
            type:String,
        }
    },
    billing:{
        date:{
            type:String,
        },
        amount:{
            type:String,
        },
        status:{
            type:String,
            enum:["payed", "pending","Not payed"],
            validate:{
                validator:(value) =>{
                    if(["payed", "pending","Not payed"].some(key => key.toLowerCase() === value.toLowerCase())){
                        throw new Error("not a valid status.!")
                    }
                }
            }
        }
    },
    usage:{
        date:{
            type:String,
        },
        usedDate:{
            type:String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    otp: {
        type: Number
    },
    otpExpiry: {
        type: Number
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;