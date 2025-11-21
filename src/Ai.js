const { GoogleGenAI } = require("@google/genai");
const { default: axios } = require("axios");
const dotenv = require("dotenv");
const { BASE_URL } = require("./utils/constants");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(message) {
    console.log(message)
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: message,
        config: {
            systemInstruction: "You are a customer supporter of an internet service provider company. And your name is chandhana"
        }
    });
    return response.text;
}

const handleCustomerData = async () => {
    try {
        const res = await axios.get(
            BASE_URL+"customers.php?username=pdr_chennakeshava",
            {
                headers: {
                    "API-KEY": process.env.CUSTOMER_API_KEY,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    main,
    handleCustomerData
};