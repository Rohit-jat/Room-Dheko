const Review = require("../models/reviews"); 
const Listing = require("../models/listing");


module.exports.newReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
  
    newReview.author = req.user._id;
  
    
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
  
    res.redirect(`/listings/${id}`);
  };


  module.exports.detroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  };