const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync");
const Review = require("../models/reviews"); 
const Listing = require("../models/listing");

const { validateReview , isLogedIN, isOwner, isReviewAutor} = require('../middleware.js');
const reviewControlloer = require("../controllers/reviews.js");






router.post("/", validateReview, wrapAsync(reviewControlloer.newReview));

router.delete("/:reviewId", isLogedIN , isReviewAutor,wrapAsync(reviewControlloer.detroyReview)); 



module.exports = router;