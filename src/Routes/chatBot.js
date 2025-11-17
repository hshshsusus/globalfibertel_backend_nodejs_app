const express = require("express");
const { userAuth } = require("../utils/reusableFunctions");
const main = require("../Ai");

const chatBotRouter = express.Router();

chatBotRouter.post("/user/chatbot", userAuth, async (req, res) => {
    try {
        const { message } = req.body;
        const user = req.user;
        console.log(user)

        if (!message) return;

        const reply = await main(message);

        res.status(200).json([{ "userMessage": message, "Ai": reply }]);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = chatBotRouter;