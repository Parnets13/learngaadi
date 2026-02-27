const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB CONNECTED...");
  } catch (err) {
    console.error("DB CONNECTION FAILED:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
