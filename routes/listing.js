const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");   
const wrapAsync = require("../utility/wrapAsync");
const { isLogedIN, isOwner, validateListing } = require('../middleware.js');
const listingController = require("../controllers/listings");
const listing = require('../models/listing');
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })




router.route("/")
.get( wrapAsync(listingController.index) )
.post( upload.single('listing[image]'), wrapAsync(listingController.newListing));
// .post(upload.single("listing[image]") , (req , res)=>{
//   res.send(req.file);
// })


//index 

//new route
router.get("/new" ,isLogedIN, async(req , res ) =>{
  
  res.render("listings/new")
});


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
.delete(isLogedIN, isOwner,wrapAsync(listingController.destory));


//edit route
router.get("/:id/edit" ,isLogedIN,isOwner ,wrapAsync( listingController.editListing));






module.exports = router;    