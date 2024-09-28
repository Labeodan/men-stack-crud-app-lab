const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan")
require("dotenv/config")
const Dogs = require("./models/dogs")
const methodOverride = require("method-override")


// !Variables
const app = express();
const port = 3000




// !MIDDLEWEAR
// app.set("view engin", "ejs");
app.use(morgan("dev"))
// for using stylesheets
app.use('/public', express.static('public'));
// Accepting forms data
app.use(express.urlencoded({extended: true}));
// override post method
app.use(methodOverride("_method"))


// !Routes
// Home Page
app.get("/", (req, res) => {
    res.render("index.ejs")
})


// Dogs Page
app.get("/dogs", async (req, res) => {
    try {
        const dogs = await Dogs.find()
        return res.render("dogs/index.ejs", {
            dogs
        })
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
} )

///dogs/new
app.get("/dogs/new", (req, res) => {
    res.render("./dogs/new.ejs")
}) 


// create /dogs
app.post("/dogs", async (req, res) => {
    try {
        const dog = await Dogs.create(req.body)

       return res.redirect("/dogs/new")
    } catch (error) {
        console.log(error)
       return  res.status(500).send("Internal Server Error")
    }
})


app.get("/dogs/:id", async (req, res) => {
    try {
        id = req.params.id
        const dog = await Dogs.findById(id)
        res.render("dogs/show.ejs", {
            dog
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})

// Delete resource
app.delete("/dogs/:id", async (req, res) => {
    try {
        const id = req.params.id
        const deletedResource = await Dogs.findByIdAndDelete(id)
        console.log(deletedResource)
        res.redirect("/dogs")
    } catch (error) {
        console.log(error)   
    }
})


// Edit resource
app.get("/dogs/:id/edit", async (req, res) =>{
    try {
        const id = req.params.id
        const dog = await Dogs.findById(id)
       res.render("dogs/edit.ejs", {dog})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})


app.put("/dogs/:id", async (req, res) => {
    try {
        const id = req.params.id
        const updatedDog = req.body
        const dog = await Dogs.findByIdAndUpdate(id, updatedDog)
        res.redirect(`/dogs/${id}`)
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})




// ! 404
app.use("*", (req, res) => {
    return res.send("Page Not Found")
})






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