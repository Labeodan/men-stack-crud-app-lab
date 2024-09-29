const mongoose = require("mongoose");
require("dotenv/config");
const Dogs = require("../models/dogs")
const alldogs = require("./Data/dogs.json")



const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to DB")

        await Dogs.deleteMany()
        console.log("All dogs deleted")
        
        await Dogs.create(alldogs)
        console.log("All dogs Added")

        await mongoose.disconnect(process.env.MONGODB_URI)
        console.log("Disconnected from DB")

    } catch (error) {
        console.log("An Error Occured")
    }

}

seed()