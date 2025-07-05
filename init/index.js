const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const fetch = require("node-fetch");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MAP_TOKEN = "nzI0ZjtX9b7tnpnW12Fn";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}







const geocode = async (address) => {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${MAP_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].center; // [lng, lat]
  }
  // Default to [0,0] if not found
  return [0, 0];
};




const initDB = async () => {
  await Listing.deleteMany({});
  // Use Promise.all to geocode all listings in parallel
  const listingsWithGeo = await Promise.all(
    initData.data.map(async (obj) => {
      const address = `${obj.location}, ${obj.country}`;
      const coordinates = await geocode(address);
      return {
        ...obj,
        owner: "681edf3ee561667f96ed6d89",
        geometry: {
          type: "Point",
          coordinates
        }
      };
    })
  );
  await Listing.insertMany(listingsWithGeo);
  console.log("data was initialized");
};



initDB();


















// const initDB = async () => {
//   'pizza man'
//   await Listing.deleteMany({});
//    initData.data = initData.data.map((obj)=>(
//     {...obj, owner:"681edf3ee561667f96ed6d89",
//      geometry: {
//       type: "Point",
//       coordinates: [77.5946, 12.9716] 
//     }
//    }));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();
