const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
    breed: {type: String, required: true},
    size: { type: String },
    lifespan_years: { type: Number },
    temprament: { type: String },
    origin: { type: String },
    averageWeight_Kg: { type: Number }
})

// model
const Dog = mongoose.model("dog", dogSchema)
// export model
module.exports = Dog