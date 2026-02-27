const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    CourseCategory: {
      type: String,
    },
    Name: { type: String },
    discription: {
      type: String,
    },
    TheorySession: {
      type: String,
    },
    SimulatorSession: {
      type: String,
    },
    PracticalSession: {
      type: String,
    },
    TheoryExam: {
      type: String,
    },
    PracticalExam: {
      type: String,
    },
    DemoSession: {
      type: String,
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
    Amount: {
      type: Number,
    },
    GST: {
      type: Number,
    },
    Discount: {
      type: Number,
    },
    DrivingLicence: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", Course);
module.exports = CourseModel;
