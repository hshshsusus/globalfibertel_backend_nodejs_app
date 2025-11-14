const express = require("express");
const connectToDB = require("./src/Database/connectDB");
const cors = require("cors")
const dotenv = require("dotenv");
const plansRouter = require("./src/Routes/plans");
const authRouter = require("./src/Routes/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const defaultRouter = require("./src/Routes/default");
const connection = require("./src/Database_SQL/connectDB");
const contactRouter = require("./src/Routes/contact");
// const connaction = require("./src/Database_SQL/connectDB")

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://192.168.6.30:5173", "http://localhost:5173"];

app.use(cors({
  origin: "http://192.168.6.30:5173",
  credentials: true,
}));

app.use("/", plansRouter);
app.use("/", authRouter);
app.use("/", defaultRouter);
app.use("/", contactRouter);

mongoose.connect(process.env.DB_URL_STRING + "clone-project2")
    .then((res) => {
        console.log("DB connected successfully.!")
        app.listen(process.env.PORT, () => {
            console.log(`server running at port ${process.env.PORT}`)
        })
    }).catch((err) => {
        console.log(err.message)
    })

