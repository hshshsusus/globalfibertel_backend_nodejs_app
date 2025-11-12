const mongoose = require("mongoose");
const { emailRegex, passwordRegex } = require("../utils/constants");

const userSchema = new mongoose.Schema({
    fristName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:35,
    },
    lastName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:35,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate:{
            validator:(value) =>{
                return emailRegex.test(value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator:(value) =>{
                return passwordRegex.test(value)
            }
        }
    },
    photoURL:{
        type:String,
        validate:{
            validator:(value) =>{

            }
        },
        default:"https://cdn-icons-png.flaticon.com/512/709/709722.png"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
    otp:{
        type:Number
    },
    otpExpiry:{
        type:Number
    }
},{
    timestamps:true
});

const User = mongoose.model("User", userSchema);

module.exports = User;