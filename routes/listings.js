const express=require("express");
const router=express.Router();
const asyncWrape=require("../utils/asyncWrape.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


router.route("/")
.get(asyncWrape(listingController.index))
.post(isLoggedIn,upload.single("listing[image.url]") ,
asyncWrape(listingController.newListing));


// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(asyncWrape(listingController.showListings))
.put(
   isLoggedIn
  ,isOwner
  ,upload.single("listing[image.url]")
  ,asyncWrape(listingController.updateListing))
.delete(isLoggedIn,isOwner, asyncWrape(listingController.deleteListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, asyncWrape(listingController.editListing));






  module.exports=router;