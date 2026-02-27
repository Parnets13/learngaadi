const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const Booking = new Schema(
  {
    BookingId: {
      type: ObjectId,
    },

    Rejected_Driver_ID: [
      {
        type: ObjectId,
      },
    ],
    Attendance: [
      {
        Attendance_Date: {
          type: String,
        },
        Attendance_Status: {
          type: String,
        },
        DriverID: {
          type: ObjectId,
        },
        DriverName: { type: String },
        DriverMobile: { type: Number },
        AssignedBy: { type: String },
        BookingTime: {
          type: String,
        },
        TrainingTime: {
          type: String,
        },
      },
    ],
    Extended_Days: {
      type: Number,
      default: 0,
    },
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
      require: true,
    },
    PracticalDays: {
      type: Number,
    },
    SimulatorDays: {
      type: Number,
    },
    TheoryDays: {
      type: Number,
    },
    userName: { type: String },

    userContactNumber: { type: String },
    userArea: { type: String },
    userCity: { type: String },
    userState: { type: String },
    userCountry: { type: String },
    userPincode: { type: String },
    Name: { type: String },
    DrivingLicence: { type: Boolean },
    PracticalDays: { type: Number },
    SimulatorDays: { type: Number },
    TheoryDays: { type: Number },
    CourseCategory: { type: String },
    selectedDate: { type: String },
    Status: { type: String, default: "Ongoing" },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", Booking);
module.exports = BookingModel;
