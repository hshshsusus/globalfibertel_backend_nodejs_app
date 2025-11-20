const express = require("express");
const { userAuth, getBotResponse } = require("../utils/reusableFunctions");
const main = require("../Ai");
const connection = require("../Database_SQL/connectDB");

const chatBotRouter = express.Router();

chatBotRouter.post("/user/chatbot", async (req, res) => {
    try {
        const { message } = req.body;
        const user = req.user;

        if (!message) return;

        const reply = await main(message);

        res.status(200).json([{ "userMessage": message, "Ai": reply }]);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

chatBotRouter.post("/user/chatbot/q&a", async (req, res) => {
    try {

        const { userQuestion } = req.body;

        if (!userQuestion.trim()) return;

        const res1 = await connection.promise().query("select * from chatbotQA");

        const response = getBotResponse(userQuestion, res1[0]);

        res.status(200).json(response)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = chatBotRouter;