const express = require("express");
const bcrypt = require("bcrypt")

const router = express.Router();

const User = require("../models/user.js")



// SIGN UP
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs")
})



// Create User
router.post("/sign-up", async (req, res) => {
    try {
        // check passwords match
        if (req.body.password !== req.body.confirmpassword) {
            return res.status(422).send("The Passwords Did Not Match")
        }
        // hash password
        req.body.password = bcrypt.hashSync(req.body.password, 10)

        // Attempt to create a user
        const newUser = await User.create(req.body)

        // Redirect to the signin page
        res.redirect("auth/sign-in")

        // Automatically sign them in




    } catch (error) {
        console.log(error)
        if (error.code === 11000){
            return res.status(422).send("<h1>Username already taken</h1>")
        }
        return res.status(500).send("<h1>An Error Occured</h1>")
    }
})


// SIGN IN FORM
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs")
})


router.post("/sign-in", async (req, res) => {
    try {
        const userInDatabase = await User.findOne({username: req.body.username})

        // invalidate the request with unauthorised if username is not found 
        if (!userInDatabase ) {
            console.log("Username did not match an existing user")
            return res.status(401).send("Login failed. Please try again")
        }

        // If passswords do match, send an identical response than the 401 above
        if (!bcrypt.compareSync(req.body.password, userInDatabase.password)) {
            console.log("password did not match")
            return res.status(401).send("Login failed. Please try again")
        }

        // Create a session to sign the user in
        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        }

        return res.redirect("/")

    } catch (error) {
        console.log(error)
        return res.status(500).send("<h1>An Error Occured</h1>")
    }
})


// Sign out
router.get("/sign-out", (req, res) =>{
    // destroy esesting session
    req.session.destroy()
    return res.redirect("/")
})

module.exports = router