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
        req.body.breeder = req.session.user._id
        const dog = await Dog.create(req.body)
        console.log(dog)
       return res.redirect("/dogs/new")
    } catch (error) {
        console.log(error)
       return  res.status(500).send("Internal Server Error")
    }
})


router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const dog = await Dog.findById(id).populate("breeder").populate("reviews.user")
        // console.log("breederID:", dog.breeder._id)
        // console.log("logged in user:", res.locals.user._id)
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
        if (mongoose.Types.ObjectId.isValid(id)) {
            const dog = await Dog.findById(id)
            if (!dog) {return next()}

            if (!dog.breeder.equals(req.session.user._id)) {
                return res.redirect(`/dogs/${id}`)
            }

            return res.render("dogs/edit", {dog})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})


router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const dogToUpdate = await Dog.findById(id)
        if (dogToUpdate.breeder.equals(req.session.user._id)) {
            const updatedDog = req.body
            const dog = await Dog.findByIdAndUpdate(id, updatedDog)
           return  res.redirect(`/dogs/${id}`)  
        } else {
            throw new Error("User is not authorised to perform this action")
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
})


// Review section
router.post("/:id/reviews", async (req, res, next) => {
    try {
        // Add signed in user id to the user field
    req.body.user = req.session.user._id

    // Find the dog that we want to add the comment to
    const dog = await Dog.findById(req.params.id)
    if (!dog) return next() // send 404

    // Push the req.body (new comment) into the comments array
    dog.reviews.push(req.body)

    // Save the dog we just added the comment to - this will persist to the database
    await dog.save()

    return res.redirect(`/dogs/${req.params.id}`)
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred.</h1>')
    }
})




router.delete("/:dogId/reviews/:reviewId", async (req, res, next) => {
    try {
        const dog = await Dog.findById(req.params.dogId)
        if (!dog) return next()

        const reviewToDelete = dog.reviews.id(req.params.reviewId)

        // delete review 
        reviewToDelete.deleteOne()
        // persist 
        await dog.save()
        // redirect to show page
        return res.redirect(`/dogs/${req.params.dogId}`)
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred.</h1>')
    }
})


module.exports = router