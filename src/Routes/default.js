const express = require("express");
const { adminAuth } = require("../utils/reusableFunctions");
const HomeData = require("../Database/defaultDataSchema");
const connection = require("../Database_SQL/connectDB");

const defaultRouter = express.Router();

defaultRouter.get("/home/get", async (req, res) => {
    try {
        const homeData = await HomeData.find();
        res.status(202).json(homeData)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

defaultRouter.post("/admin/home/add", adminAuth, async (req, res) => {
    try {
        const { banners, plansText, services, subscribersCount, FAQ, footer } = req.body;
        const data = await HomeData({
            banners,
            plansText,
            services,
            subscribersCount,
            FAQ,
            footer
        })

        const savedData = await data.save();
        res.send(savedData)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

defaultRouter.patch("/admin/home/addbanner/:id", adminAuth, async (req, res) => {
    try {
        const { heading, imageURL, option1, option2, number1, number2 } = req.body;
        const { id } = req.params;

        const homeData = await HomeData.findOne({ _id: id });
        if (!homeData) {
            throw new Error("Data not found.!");
        };

        const updatedHomeDoc = await HomeData.updateOne({ _id: id },
            {
                $push: {
                    banners: { heading, imageURL, option1, option2, number1, number2 }
                }
            }
        )

        // console.log(update)
        res.status(202).json({ updatedHomeDoc })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

defaultRouter.patch("/admin/home/addsubcount/:id", adminAuth, async (req, res) => {
    try {
        const { countText, numberOfCount } = req.body;
        const { id } = req.params;

        const homeData = await HomeData.findOne({ _id: id });
        if (!homeData) {
            throw new Error("Data not found.!");
        };

        const updatedHomeDoc = await HomeData.updateOne({ _id: id },
            {
                $push: {
                    subscribersCount: { countText, numberOfCount }
                }
            }
        )
        // console.log(update)
        res.status(202).json({ updatedHomeDoc })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

defaultRouter.patch("/admin/home/addfaq/:id", adminAuth, async (req, res) => {
    try {
        const { question, answer } = req.body;
        const { id } = req.params;

        const homeData = await HomeData.findOne({ _id: id });
        if (!homeData) {
            throw new Error("Data not found.!");
        };

        const updatedHomeDoc = await HomeData.updateOne({ _id: id },
            {
                $push: {
                    "FAQ.faqs": { answer, question }
                }
            }
        )

        // console.log(update)
        res.status(202).json({ updatedHomeDoc })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

defaultRouter.patch("/update/homedocument/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const service = req.body

        const updated = await HomeData.findOne({ _id: id })

        if (!updated) {
            throw new Error('document not found.!')
        }

        if (!service) {
            throw new Error("No data!")
        }
        const doc = await HomeData.updateOne({ _id: id }, { $set: { services: service } }, { new: true })
        res.send(doc)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

defaultRouter.get("/homepage/data/get", async (req, res) => {
    try {
        const homepagedata = {};

        const [homepage] = await connection.promise().query("select * from homepage");
        homepagedata.plansText = homepage[0].plansText;
        homepagedata.footer = homepage[0].footer;

        const [banners] = await connection.promise().query("select * from banners");
        homepagedata.banners = banners;

        const [subscriberscount] = await connection.promise().query("select * from subscriberscount");
        homepagedata.subscriberscount = subscriberscount;

        const [FAQ] = await connection.promise().query("select * from FAQ");
        homepagedata.FAQ = FAQ;

        const [services] = await connection.promise().query("select * from services");
        homepagedata.services = services;

        res.status(200).json(homepagedata);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

defaultRouter.get("/home/topnav", async (req, res) => {
    try {

        const [top] = await connection.promise().query("select * from topBar");

        res.status(200).json(top[0])
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

defaultRouter.get("/home/footer", async (req, res) => {
    try {
        const footer = {};

        const services = await connection.promise().query("select * from our_services");
        footer.ourServices = services[0];
        
        const importentLinks = await connection.promise().query("select * from importentlink");
        footer.importentLinks = importentLinks[0];

        const products = await connection.promise().query("select * from our_products");
        footer.ourProducts = products[0];

        const companyInfo = await connection.promise().query("select * from company_info");
        footer.companyInfo = companyInfo[0];

        res.status(200).json(footer)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = defaultRouter;