


const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");  // ✅ Fixed model import

const mongo_URL = "mongodb://127.0.0.1:27017/roomRentl";  // ✅ Ensure correct MongoDB URL

// ✅ Properly define and call main function
async function main() {
  try {
    await mongoose.connect(mongo_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

const initDB = async () => {
  try {
    await main();  // ✅ Ensure database is connected before inserting data
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj , owner :"67e5a4e703b4103a57dd3f83"}));
    initData.data = initData.data.map((obj) => ({
  ...obj,
  number: "9783118440"  
}));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
  } catch (err) {
    console.error("Error initializing data:", err);
  } finally {
    mongoose.connection.close();  // Close connection after inserting data
  }
};

initDB();

