const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
    breed: {type: String, required: true, unique: true},
    size: { type: String },
    lifespan_years: { type: Number },
    temprament: { type: String },
    origin: { type: String },
    averageWeight_Kg: { type: Number },
    breeder: {type: mongoose.Types.ObjectId, ref: "User", required:true}
})

// model
const Dog = mongoose.model("dog", dogSchema)
// export model
module.exports = Dog