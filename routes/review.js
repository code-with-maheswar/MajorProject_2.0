const express=require("express");
const router=express.Router({mergeParams:true});
const asyncWrape=require("../utils/asyncWrape.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


 //Review 
  //Post Route
   
router.post("/",isLoggedIn,asyncWrape(reviewController.createReview));

//Delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, asyncWrape(reviewController.destroyReview));


module.exports=router;