const Listing = require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
module.exports.index = async(req,res)=>{
    const allListings=await Listing.find();
    res.render("./listings/index.ejs",{allListings});
}


module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");}


module.exports.showListings = async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author"
        }
     })
      .populate("owner");

    if(! listing){
      req.flash("error","Listing  doesn't  Exist");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing, MAP_TOKEN: process.env.MAP_TOKEN });
};    


module.exports.newListing =  async (req, res,next) => {
 let url = req.file.path;
 let filename = req.file.filename;


 const address = `${req.body.listing.location}, ${req.body.listing.country}`;
  const geoRes = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${process.env.MAP_TOKEN}`
  );
  const geoData = await geoRes.json();

  // Default coordinates if not found
  let coordinates = [0, 0];
  if (geoData.features && geoData.features.length > 0) {
    coordinates = geoData.features[0].center;
  }
  const newListing = new Listing(req.body.listing)
   newListing.owner = req.user._id;
   newListing.image = {url,filename}
   newListing.geometry = { type: "Point", coordinates };

    await newListing.save();
    req.flash("success","New listing is created");
    res.redirect("/listings");
  
  }



  module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(! listing){
      req.flash("error","Listing  doesn't  Exist");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_200,h_100");
    
    res.render("listings/edit.ejs",{ listing , originalImageUrl });
  }


  module.exports.updateListing =  async (req, res) => {
 let { id } = req.params;  
 let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing });
 
 if(typeof req.file != "undefined"){
 let url = req.file.path;
 let filename = req.file.filename;
 listing.image = {url,filename};
 await listing.save();
 }
    req.flash("success","Listing is Updated");
    res.redirect(`/listings/${id}`);
  }


  module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing is Deleted");
    res.redirect("/listings");
  }
