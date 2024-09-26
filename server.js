const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan")
require("dotenv/config")
const Dogs = require("./models/dogs")

// !Variables
const app = express();
const port = 3000



// !MIDDLEWEAR
// app.set("view engin", "ejs");
app.use(morgan("dev"))
// for using stylesheets
app.use(express.static("public"))


// !Routes
// Landing Page
app.get("/dogs", async (req, res) => {
    try {
        res.render("index.ejs")
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
} )










// ! Connect to DB and Start Server

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Successfully Connected to DB")

        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
        
    } catch (error) {
        console.log("cannot connect to DB")
    }
}


startServer()