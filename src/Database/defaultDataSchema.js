const mongoose = require("mongoose");
const { subscribe } = require("../Routes/auth");
const { validate } = require("./userSchema");
const { photoURLRegex } = require("../utils/constants");

const banner = new mongoose.Schema({
    heading: {
        type: String,
        minLength: 5,
        maxLength: 155,
        trim: true
    },
    imageURL: {
        type: String,
    },
    option1: {
        type: String,
        minLength: 5,
        maxLength: 155,
        trim: true
    },
    option2: {
        type: String,
        minLength: 5,
        maxLength: 155,
        trim: true
    },
    number1: {
        type: Number,
        minLength: 10,
        maxLength: 10,
        trim: true
    },
    number2: {
        type: Number,
        minLength: 10,
        maxLength: 10,
        trim: true
    },
})

const eachService = new mongoose.Schema({
    serviceName: {
        type: String,
        minLength: 4,
        maxLength: 65,
        trim: true,
        default: "Broadband"
    },
    serviceDescription: {
        type: String,
        minLength: 4,
        maxLength: 355,
        trim: true,
        default: "Globalfibertel Broadband offers versatile speeds and smooth browsing experience that is completely unmatched for.Try it to believe it!..",
    },
    bgImgURL: {
        type: String,
        validate: {
            validator: (value) => {
                if (!photoURLRegex.test(value)) {
                    throw new Error("Invalid image url..!")
                }
            }
        }
    }
})

const service = new mongoose.Schema({
    mainText: {
        type: String,
        default: "Our popular services"
    },
    eachService: [eachService]
})

const count = new mongoose.Schema({
    countText: {
        type: String,
        trim: true,
        default: "Happy Subscribers",
    },
    numberOfCount: {
        type: Number,
        trim: true,
    }
})

const faqsList = new mongoose.Schema({
    question: {
        type: String,
        minLength: 10,
        maxLength: 200,
        trim: true
    },
    answer: {
        type: String,
        minLength: 10,
        maxLength: 1000,
        trim: true
    }
})

const defaultDataShema = new mongoose.Schema({
    banners: [banner],
    plansText: {
        type: String,
        default: "Our popular plans"
    },
    services: service,
    subscribersCount: [count],
    FAQ: {
        faqText: {
            type: String,
            default: "FAQ",
            uppercase: true,
            trim: true
        },
        faqs: [faqsList],
    },
    footer: {
        type: String,
    }
})

const HomeData = new mongoose.model("HomeData", defaultDataShema);

module.exports = HomeData;