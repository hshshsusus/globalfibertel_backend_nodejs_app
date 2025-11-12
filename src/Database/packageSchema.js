const mongoose = require("mongoose");
require('mongoose-currency');
const Currency = mongoose.Schema.Types.Currency;

const packageSchema = new mongoose.Schema({

    upload: {
        type: String,
        required: true,
        minLength: 0,
        uppercase: true,
        trim: true
    },
    download: {
        type: String,
        required: true,
        minLength: 0,
        uppercase: true,
        trim: true,
    },
    validity: {
        type: String,
        required: true,
        minLength: 0,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    unlimited: {
        type: Boolean
    },
    addedAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    GST: {
        type: String,
        default: "GST extra"
    },
    extraDetails: {
        type: String,
        default: "Equipment price add seperatly"
    }
},
    {
        timestamps: true
    })

const Package = new mongoose.model("Package", packageSchema);

module.exports = Package;