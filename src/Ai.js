const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(message){
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

module.exports = main;