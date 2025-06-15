if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app =  express()
const mongoose = require("mongoose");
const Listing = require("./models/listing"); 
const path = require("path"); 
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utility/expressError");
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const UserRouter = require("./routes/user");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users"); 
const searchRoutes = require('./routes/search'); // ✅ path sahi ho





//  MongoDB Connection URL
// const mongo_URL = "mongodb://127.0.0.1:27017/roomRentl"; 


const db_url = process.env.ATLUS_URL;

// ✅ MongoDB Connection with error handling
async function main() {
  try {
    await mongoose.connect(db_url, {
      serverSelectionTimeoutMS: 5000, // Timeout fix
      socketTimeoutMS: 45000, // Socket timeout fix
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
  }
}
main(); // ✅ Function call nahi bhoolna!

// ✅ EJS setup fix
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname , "/public")));






const store = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
   secret: process.env.SECRET,
  }, 
  touchAfter : 24 * 3600 ,
})
store.on("error" , ()=>{
  console.log("ERROR IN MONGO SESSION STORE" , err);
});

const sessionOptions = {
  secret: "mySuperSercretCode",
  resave: false,
  saveUninitialized: true,
};


// ✅ Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());


app.use (passport.initialize());
app.use (passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/demouser", async (req , res)=>{
//   let fakeUser =  new User({
//     email:"jat144@gmail.com",
//     username:"Jaat",
//   });


// // let registeredUser =  User.register (fackUser , "jatboy");
// let registeredUser = await User.register(fakeUser, "jatboy144"); 
// res.send(registeredUser);
// });
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});


// for path variable to contol search bar dsplay
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});



//  Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/" , UserRouter);

app.use('/search', searchRoutes);

//  Error Handling

app.all("*", (req, res, next) => {
  next(new ExpressError( 404 , "Page not found")); // Class name should be correct
});

//  Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err; 
  res.render("listings/err.ejs" , {message})
});

//  Fetch Listings Function
async function fetchListings() {
    try {
        const listings = await Listing.find({});
        // console.log("Listings:", listings);
    } catch (error) {
        console.error("❌ Error fetching listings:", error);
    }
}

//  Function ko call karna mat bhoolna!
fetchListings();

//  Server start
app.listen(8080, () => {
    console.log("🚀 Server is running on port 8080");
});
