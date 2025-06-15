const User = require("../models/users");

module.exports.UserLogin =  async (req, res) =>{
    req.flash("success" , "Welcome back to Room Dheko!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};


module.exports.userSignup = async (req, res) => {
   try{
    let {username , email , password } = req.body;

    const newUser = new User({username , email });
    const registeredUser = await User.register(newUser , password);
    req.logIn(registeredUser  , (err)=>{
        if(err){
        next(err);
        }
    
     req.flash("success" , "Welcome to the Room Dheko!");
    res.redirect("/listings");

   });
   
   }
   catch(e){
    req.flash("error" , e.message);
  
    res.redirect("/signup");
   };
};

module.exports.userLogout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
         return   next(err);
        }
        req.flash("success" , "You successfully Logout!");
        res.redirect("/login");
    });
};