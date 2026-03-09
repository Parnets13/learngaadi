const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("DB CONNECTED...");
  } catch (err) {
    console.error("DB CONNECTION FAILED:", err.message);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = { connectDB };
