const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const DailyBooking = new Schema(
  {
    MainBookingId: {
      type: ObjectId,
    },
    CourseId: {
      type: ObjectId,
    },
    CourseCategory: {
      type: String,
    },
    StartAddress: {
      type: String,
    },
    latitute: {
      type: Number,
    },
    logitute: {
      type: Number,
    },
    // Driverlatitude: {
    //   type: Number,
    // },
    // Driverlongitude: {
    //   type: Number,
    // },
    SelectedTime: {
      type: String,
    },
    Rejected_Driver_ID: [
      {
        type: ObjectId,
      },
    ],
    Amount: {
      type: Number,
    },
    GST: {
      type: Number,
    },
    Discount: {
      type: Number,
    },
    TotalAmount: {
      type: Number,
    },
    userId: {
      type: ObjectId,
    },
    userName: { type: String },
    userContactNumber: { type: String },
    userArea: { type: String },
    userCity: { type: String },
    userState: { type: String },
    userCountry: { type: String },
    userPincode: { type: String },
    Name: { type: String },
    BookingDate: { type: String },
    Status: { type: String, default: "Pending" },

    DriverID: {
      type: ObjectId,
    },
    DriverName: { type: String },
    AssignedBy: { type: String },
    DriverMobile: { type: Number },
    TrainingTime: { type: String },
    startkm: { type: Number },
    endkm: { type: Number },
    TotalKm: { type: Number },
    Driverlatitude: { type: Number },
    Driverlongitude: { type: Number },
    CustomerReview: { type: String },
  },
  { timestamps: true }
);

const DailyBookingModel = mongoose.model("DailyBooking", DailyBooking);
module.exports = DailyBookingModel;
