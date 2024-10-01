const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan")
require("dotenv/config")
const Dogs = require("./models/dogs")
const methodOverride = require("method-override")
const session = require("express-session")
const router = require("./controllers/events")
const authrouter = require("./controllers/auth")
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");




console.log()

// !Variables
const app = express();
const port = 3000




// !MIDDLEWEAR
app.set("view engine", "ejs");
app.use(morgan("dev"))
// for using stylesheets
app.use('/public', express.static('public'));
// Accepting forms data
app.use(express.urlencoded({extended: true}));
// override post method
app.use(methodOverride("_method"))
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
);
  
app.use(passUserToView);



// !Routes
// Landing Page
app.get("/", (req, res) => {
    console.log(req.session)
    res.render("index")
})



app.get("/vip-lounge", isSignedIn, (req, res) => {
    res.send(`Welcome to the party ${res.locals.user.username}.`);
});
  


app.use("/dogs", isSignedIn, router)
app.use("/auth", authrouter)





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