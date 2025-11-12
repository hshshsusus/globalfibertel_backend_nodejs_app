const express = require("express");
const Package = require("../Database/packageSchema");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Admin = require("../Database/adminSchema");
const { adminAuth } = require("../utils/reusableFunctions");
const connection = require("../Database_SQL/connectDB");

dotenv.config()

const plansRouter = express.Router();

plansRouter.post("/packages/add", adminAuth, async (req, res) => {
    try {

        const { upload, download, validity, price } = req.body;

        const savePack = new Package({
            upload,
            download,
            validity,
            price
        });
        const p = await savePack.save();
        res.send(p);
    } catch (error) {
        res.status(404).json(error.message)
    }
})

plansRouter.patch("/packages/update/:id", adminAuth, async (req, res) => {
    try {
        const { upload, download, validity, price } = req.body;
        const { id } = req.params;

        if (!upload || !download || !validity || !price || !id) {
            throw new Error("Mandatory fields should not be empty..!")
        }

        const updatablePack = await Package.findOneAndUpdate(
            { _id: id },
            {
                upload,
                download,
                validity,
                price
            },
            {
                returnDocument: "after"
            });

        const updatedPack = await updatablePack.save();

        res.send(updatedPack);

    } catch (error) {
        res.status(404).json(error.message)
    }
})

plansRouter.get("/packages/get", async (req, res) => {
    try {

        const allPackages = await Package.find({});

        if (!allPackages) {
            throw new Error("No packages are available currently.! Will be added in furthur days..")
        }

        res.send(allPackages)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//sql apis

plansRouter.get("/plans/get", async (req, res) => {
    try {
        const [plans] = await connection.promise().query("select *from plans");
        res.status(200).json(plans)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

plansRouter.post("/plans/add", adminAuth, async (req, res) => {
    try {
        const { uploadSpeed, downloadSpeed, validity, price } = req.body;
        const the = await connection.promise().query("insert into plans(uploadSpeed, downloadSpeed, validity, price) values(?,?,?,?)", [uploadSpeed, downloadSpeed, validity, price]);
        res.status(201).json("plan add successfully.!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

plansRouter.patch("/plans/update/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;

        if (!id) {
            throw new Error("No data available.!")
        }

        if (!fields) {
            throw new Error("there is no fields are available to update.!")
        }

        const columns = Object.keys(fields).map((keys) => `${keys} = ?`).join(", ");

        const values = Object.values(fields);
        values.push(id);

        const [results] = await connection.promise().query(`update plans set ${columns} where id = ?`, values)

        if (results.affectedRows === 0) {
            throw new Error("no plans updated.!")
        }
        res.status(200).json("plan updated successfully.!")
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

module.exports = plansRouter;