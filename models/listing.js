const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review=require("./review.js");
const { required } = require("joi");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  
  
  image: {
      filename:String,
      url:String
  },

  price:{
type:Number,
required:true,
  },
  location: String,
  country: String,
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"

    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  geometry: {
  type: { type: String,
     enum: ['Point'],
      default: 'Point'
      ,required:true },
  coordinates: [Number] 
},
});


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
