require("dotenv").config();
const express = require("express");
const DB = require("./DB");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const moment = require("moment");
const path = require("path");

app.use(express.json());

// Enhanced CORS configuration for development
const corsOptions = {
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("src/Public"));
app.use(express.urlencoded({ extended: true }));

// mongodb connection - properly initialize
DB.connectDB();

// Importing route files
const adminRoute = require("./src/Routes/Admin/admin");
const CategoryRoute = require("./src/Routes/Admin/Category");
const BannerRoute = require("./src/Routes/Admin/Banner");
const CourseRoute = require("./src/Routes/Admin/Course");
const NotificationRoute = require("./src/Routes/Admin/Notification");
const ForgotpasswordRoute = require("./src/Routes/Admin/Forgotpassword");

const userRoute = require("./src/Routes/User/user");
const OtpRoute = require("./src/Routes/User/Otp");
const BookingRoute = require("./src/Routes/User/Booking");
const DailyBookingRoute = require("./src/Routes/User/DailyBooking");
const BookingOTPRoute = require("./src/Routes/User/BookingOTP");

const driverRoute = require("./src/Routes/Driver/driver");
const OtpLoginRoute = require("./src/Routes/Driver/OtpLogin");

// Creating Routes
app.use("/api/admin", adminRoute);
app.use("/api/admin", CategoryRoute);
app.use("/api/admin", BannerRoute);
app.use("/api/admin", CourseRoute);
app.use("/api/admin", NotificationRoute);
app.use("/api/admin", ForgotpasswordRoute);

app.use("/api/user", userRoute);
app.use("/api/user", OtpRoute);
app.use("/api/user", BookingRoute);
app.use("/api/user", DailyBookingRoute);
app.use("/api/user", BookingOTPRoute);

app.use("/api/driver", driverRoute);
app.use("/api/driver", OtpLoginRoute);

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Create test driver endpoint (for testing only)
app.get("/api/create-test-driver", async (req, res) => {
  try {
    const driverModel = require("./src/Models/Driver/driver");
    
    // Check if driver already exists
    const existingDriver = await driverModel.findOne({ mobile: "9999999999" });
    
    if (existingDriver) {
      return res.status(200).json({ 
        message: "Test driver already exists!",
        mobile: "9999999999",
        name: existingDriver.name
      });
    }

    // Create new test driver
    const testDriver = new driverModel({
      name: "Test Driver",
      mobile: "9999999999",
      DrivingSchoolName: "Test School",
      Area: "Test Area",
      City: "Test City",
      State: "Test State",
      Country: "India",
      Pincode: "123456",
      VehicalType: "Car",
      VehicalModel: "Test Model",
      Experience: "2 years",
      status: "Online",
      blockstatus: false,
      DriverDuty: false,
    });

    await testDriver.save();
    res.status(200).json({ 
      message: "Test driver created successfully!",
      mobile: "9999999999",
      note: "Use this number to login and get OTP: 123456"
    });
  } catch (error) {
    console.error("Error creating test driver:", error);
    res.status(500).json({ 
      error: "Failed to create test driver",
      message: error.message 
    });
  }
});

// Create default categories endpoint (for testing only)
app.get("/api/create-categories", async (req, res) => {
  try {
    const CategoryModel = require("./src/Models/Admin/Category");
    
    // Check if categories already exist
    const existingCategories = await CategoryModel.find({});
    
    if (existingCategories.length > 0) {
      return res.status(200).json({ 
        message: "Categories already exist!",
        categories: existingCategories.map(c => c.catName)
      });
    }

    // Create default categories
    const categories = [
      { catName: "Car", catImage: "car.png" },
      { catName: "Bike", catImage: "bike.png" },
      { catName: "Scooter", catImage: "scooter.png" },
      { catName: "Auto", catImage: "auto.png" },
      { catName: "Truck", catImage: "truck.png" },
    ];

    await CategoryModel.insertMany(categories);
    
    res.status(200).json({ 
      message: "Categories created successfully!",
      categories: categories.map(c => c.catName)
    });
  } catch (error) {
    console.error("Error creating categories:", error);
    res.status(500).json({ 
      error: "Failed to create categories",
      message: error.message 
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Log detailed error information
  console.error('Error stack:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  
  // Send error response
  res.status(err.status || 500).json({
    status: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// API test endpoint
app.get("/api/test", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "LearnGaadi API is working!",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8781
  });
});

const os = require('os');

// Get network interfaces
const networkInterfaces = os.networkInterfaces();

// Iterate over interfaces
Object.keys(networkInterfaces).forEach(interfaceName => {
    // Filter IPv4 addresses
    const interfaceData = networkInterfaces[interfaceName].filter(
        iface => iface.family === 'IPv4' && !iface.internal
    );

    // Print each address
    interfaceData.forEach(iface => {
        console.log(`${interfaceName}: ${iface.address}`);
    });
});


app.use(express.static(path.join(__dirname, "build"))); // Change 'build' to your frontend folder if needed

// Redirect all requests to the index.html file (only if build folder exists)
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "build", "index.html");
  if (require('fs').existsSync(indexPath)) {
    return res.sendFile(indexPath);
  } else {
    return res.status(404).json({ 
      status: false, 
      message: "API is running. Frontend build not found." 
    });
  }
});

// app.all("*", (req, res) => {
//   throw new Error("Bad Request");
// });

// app.use(function (err, req, res, next) {
//   if (err.message === "Bad Request") {
//     res.status(400).json({ status: false, error: err.message });
//   }
// });

app.listen(process.env.PORT || 8781, '0.0.0.0', () => {
  console.log(`server is running on PORT ${process.env.PORT || 8781}`);
  console.log(`Local: http://localhost:${process.env.PORT || 8781}`);
  console.log(`Network: http://0.0.0.0:${process.env.PORT || 8781}`);
  console.log(`For Android Emulator: http://10.0.2.2:${process.env.PORT || 8781}`);
});
