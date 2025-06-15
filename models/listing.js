const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { string } = require("joi");

const listingSchema = new mongoose.Schema({
    title : {type : String , required:true},
    description : {type : String , required:true},
    image: {
        url : String,
        filename : String ,     
    },
    price: { type: Number, required: true, min: 0, max:100000  },

    location:{type : String , required : true},
    country :{type : String},
      number: { type: String },  
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner : {
    type : mongoose.Schema.Types.ObjectId , 
    ref :"User"},
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if (listing.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log(res);
    }
});

const listing  =mongoose.model("listing" ,listingSchema);

module.exports = listing ;

