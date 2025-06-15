const Listing = require("../models/listing")


module.exports.index =  async(req , res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
    // res.render("/listings/index.ejs" , {allListings});     never have to use .ejs with res.render
};



module.exports.newListing =  async (req, res , next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  
  const newListing =  new Listing(req.body.listing)
  newListing.owner = req.user._id;
  newListing.image = { url , filename};
  await newListing.save();
  req.flash("success" , "Successfully made a new listing!");
   res.redirect("/listings")


};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({path :"reviews" , populate : { path : "author"}}).populate("owner"); 

    if(!listing){
req.flash("error" , "Cannot find that listing");
 return res.redirect("/listings");
    }
  
    res.render("listings/show", { listing }); 
};


module.exports.editListing = async(req , res)=>{
  let { id } = req.params;
const listing = await Listing.findById(id); 
if(!listing){
  req.flash("error" , "Cannot find that listing");
   return res.redirect("/listings");
      }
 res.render("listings/edit.ejs" ,{listing});

};



module.exports.updateListing = async (req , res)=>{
  let { id } = req.params;
 let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});


 if(typeof req.file !== "undefined"){
 let url = req.file.path;
 let filename = req.file.filename;

 listing.image = {url , filename};
 await listing.save();
 }
 req.flash("success" , "Successfully Updated");
res.redirect(`/listings/${id}`);
  
};

module.exports.destory = async(req , res )=>{
    let{id} = req.params;
   const deletedlist = await Listing.findByIdAndDelete(id);

    req.flash("success" , "Successfully Deleted");
    res.redirect("/listings")
  };