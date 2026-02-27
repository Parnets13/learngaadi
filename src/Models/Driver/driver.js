const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driver = new Schema(
  {
    profilepic: { type: String },
    name: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    DrivingSchoolName: {
      type: String,
    },
    Area: {
      type: String,
    },
    City: {
      type: String,
    },
    State: {
      type: String,
    },
    Country: {
      type: String,
    },
    Pincode: {
      type: Number,
    },
    VehicalType: { type: String },
    VehicalModel: { type: String },
    Experience: { type: String },
    Aadharcard: { type: String },
    DrivingLicence: { type: String },
    DriverDuty: { type: Boolean, default: false },
    token: { type: String },
    updateTime: {
      type: Boolean,
      default: false,
    },

    availableSlots: [{ type: String }],

    blockstatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Online",
    },
  },
  { timestamps: true }
);

const driverModel = mongoose.model("driver", driver);
module.exports = driverModel;
