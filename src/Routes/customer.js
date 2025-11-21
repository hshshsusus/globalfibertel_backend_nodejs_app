const express = require("express");
const { handleCustomerData } = require("../Ai");

const customerRoute = express.Router();

customerRoute.get("/api/customer", async (req, res) => {
    try {
        const res1 = await handleCustomerData();
        res.status(200).json(res1.data)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

module.exports = customerRoute;