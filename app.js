if(process.env.SECRET != "PRODUCTION"){
require("dotenv").config();
// console.log(process.env.SECRET)
}

const express=require("express");
const app = express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const fetch = require('node-fetch');
const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratagy=require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); 
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATLASDB_URL

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
     secret:process.env.SECRET
  },
  touchAfter:24*360,
})


const sessionOptions = {
store,
secret:process.env.SECRET,
resave:false,
saveUninitialized:true,
cookie:{
  expires:Date.now()+7*24*60*60*1000,
  maxAge:7*24*60*60*1000,
  httpOnly:true,
},

}

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error = req.flash("error");
res.locals.currUser=req.user;
  next(); 
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
let{status=500,message="Some Error Occurred"}=err;

res.status(status).render("error.ejs",{message});
// res.status(status).send(message);
})

app.listen('8080',()=>{
console.log("port is listing to 8080");

});

