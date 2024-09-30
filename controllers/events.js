const express = require("express")
const mongoose = require('mongoose')
const router = express.Router()

// ! -- Model
const Dog = require('../models/dogs.js')



// Dogs Page
router.get("/", async (req, res) => {
    try {
        const dogs = await Dog.find()
        return res.render("dogs/index", {
            dogs
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
} )

///dogs/new
router.get("/new", (req, res) => {
    res.render("dogs/new")
}) 


// create /dogs
router.post("/", async (req, res) => {
    try {
        const dog = await Dog.create(req.body)

       return res.redirect("/dogs/new")
    } catch (error) {
        console.log(error)
       return  res.status(500).send("Internal Server Error")
    }
})


router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const dog = await Dog.findById(id)
        res.render("dogs/show", {
            dog
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})

// Delete resource
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const deletedResource = await Dog.findByIdAndDelete(id)
        console.log(deletedResource)
        res.redirect("/dogs")
    } catch (error) {
        console.log(error)   
    }
})


// Edit resource
router.get("/:id/edit", async (req, res) =>{
    try {
        const id = req.params.id
        const dog = await Dog.findById(id)
       res.render("dogs/edit", {dog})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})


router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const updatedDog = req.body
        const dog = await Dog.findByIdAndUpdate(id, updatedDog)
        res.redirect(`/dogs/${id}`)
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})


module.exports = router