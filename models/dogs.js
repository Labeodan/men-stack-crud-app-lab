const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
},
{
    timestamps: true // this option set to true provides a dynamic createdAt and updatedAt field that update automatically
})

const dogSchema = new mongoose.Schema({
    breed: {type: String, required: true, unique: true},
    size: { type: String },
    lifespan_years: { type: Number },
    temprament: { type: String },
    origin: { type: String },
    averageWeight_Kg: { type: Number },
    breeder: {type: mongoose.Types.ObjectId, ref: "User", required:true},
    reviews: [reviewSchema]
})

// model
const Dog = mongoose.model("dog", dogSchema)

// export model
module.exports = Dog