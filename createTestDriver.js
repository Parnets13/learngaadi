require("dotenv").config();
const mongoose = require("mongoose");
const driverModel = require("./src/Models/Driver/driver");

// Connect to MongoDB
mongoose.connect(process.env.DB_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("DB Connected"))
.catch(err => console.error("DB Error:", err));

// Create test driver
const createTestDriver = async () => {
  try {
    // Check if driver already exists
    const existingDriver = await driverModel.findOne({ mobile: 9999999999 });
    
    if (existingDriver) {
      console.log("Test driver already exists!");
      console.log("Mobile: 9999999999");
      console.log("Use this number to login");
      process.exit(0);
    }

    // Create new test driver
    const testDriver = new driverModel({
      name: "Test Driver",
      mobile: 9999999999,
      DrivingSchoolName: "Test School",
      Area: "Test Area",
      City: "Test City",
      State: "Test State",
      Country: "India",
      Pincode: 123456,
      VehicalType: "Car",
      VehicalModel: "Test Model",
      Experience: "2 years",
      status: "Online",
      blockstatus: false,
    });

    await testDriver.save();
    console.log("✅ Test driver created successfully!");
    console.log("Mobile Number: 9999999999");
    console.log("Use this number to login and get OTP");
    process.exit(0);
  } catch (error) {
    console.error("Error creating test driver:", error);
    process.exit(1);
  }
};

createTestDriver();
