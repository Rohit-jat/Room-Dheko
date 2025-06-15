const Listing = require("./models/listing");  
const Review = require("./models/reviews");  
const ExpressError = require("./utility/ExpressError");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLogedIN =(req , res ,next)=>{
    if (!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl; 
        req.flash("error" , "You Must Logined to Create New Listing ");
        return res.redirect("/login");
          }
next();

        }


module.exports.saveRedirectUrl = (req , res ,next)=>{
if(req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}



module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You do not own this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
};


//validation
module.exports.validateListing = (req , res  , next )=>{
  let {error} = listingSchema.validate(req.body);
if(error){
  throw new ExpressError(400 , error)
}else{
  next();
}
};



module.exports.validateReview = (req , res  , next )=>{
  let {error} = reviewSchema.validate(req.body);
if(error){
  throw new ExpressError(400 , error) 
}
else{ 
  next();
}};




module.exports.isReviewAutor = async (req, res, next) => {
  let { id , reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not own this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};