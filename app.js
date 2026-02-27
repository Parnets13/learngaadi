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
app.use(cors());
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

app.listen(process.env.PORT || 8781, () => {
  console.log(`server is running on PORT ${process.env.PORT || 8781}`);
});
