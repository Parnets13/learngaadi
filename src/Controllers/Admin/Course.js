const CourseModel = require("../../Models/Admin/Course");

class Course {
  async addCourse(req, res) {
    try {
      const {
        CourseCategory,
        Name,
        discription,
        TheorySession,
        SimulatorSession,
        PracticalSession,
        TheoryExam,
        PracticalExam,
        DemoSession,
        PracticalDays,
        SimulatorDays,
        TheoryDays,
        Amount,
        GST,
        Discount,
        DrivingLicence,
      } = req.body;
      if (!CourseCategory) {
        return res.status(500).json({ error: "please provide Course name" });
      } else {
        const newCourse = await CourseModel.create({
          CourseCategory: CourseCategory,
          Name: Name,
          discription: discription,
          TheorySession: TheorySession,
          SimulatorSession: SimulatorSession,
          PracticalSession: PracticalSession,
          TheoryExam: TheoryExam,
          PracticalExam: PracticalExam,
          DemoSession: DemoSession,
          PracticalDays: PracticalDays,
          SimulatorDays: SimulatorDays,
          TheoryDays: TheoryDays,
          Amount: Amount,
          GST: GST,
          Discount: Discount,
          DrivingLicence: DrivingLicence,
        });
        if (newCourse) {
          return res.status(201).json({ success: "new Course added..." });
        }
        return res
          .status(400)
          .json({ error: "Something went wrong!!! please try again" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCourse(req, res) {
    try {
      const CourseList = await CourseModel.find({}).sort({ _id: -1 });
      if (CourseList?.length > 0) {
        return res.status(200).json({ CourseList: CourseList });
      }
      return res.status(400).json({ CourseList: CourseList });
    } catch (error) {
      console.log(error);
    }
  }

  async editCourse(req, res) {
    try {
      const Courseid = req.params?.id;
      const {
        CourseCategory,
        Name,
        discription,
        TheorySession,
        SimulatorSession,
        PracticalSession,
        TheoryExam,
        PracticalExam,
        DemoSession,
        PracticalDays,
        SimulatorDays,
        TheoryDays,
        Amount,
        GST,
        Discount,
        DrivingLicence,
      } = req.body;

      const isCoursepresent = await CourseModel.findOne({
        _id: Courseid,
      });
      if (!isCoursepresent) {
        return res.status(400).json({
          error: "Course is not present!!! Something went wrong",
        });
      }

      const editCourse = await CourseModel.findOneAndUpdate(
        { _id: Courseid },
        {
          CourseCategory: CourseCategory,
          Name: Name,
          discription: discription,
          TheorySession: TheorySession,
          SimulatorSession: SimulatorSession,
          PracticalSession: PracticalSession,
          TheoryExam: TheoryExam,
          PracticalExam: PracticalExam,
          DemoSession: DemoSession,
          PracticalDays: PracticalDays,
          SimulatorDays: SimulatorDays,
          TheoryDays: TheoryDays,
          Amount: Amount,
          GST: GST,
          Discount: Discount,
          DrivingLicence: DrivingLicence,
        }
      );
      if (!editCourse) {
        return res.status(400).json({
          error: "Course is not edited, please try again!!!",
        });
      }
      return res.status(200).json({ success: "Course is edited successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCourse(req, res) {
    try {
      const Courseid = req.params?.id;
      if (!Courseid) {
        return res.status(400).json({ error: "Please provide Course id" });
      }
      const deleteCourse = await CourseModel.findOneAndDelete({
        _id: Courseid,
      });
      if (!deleteCourse) {
        return res.status(400).json({ error: "Course is not deleted!!!" });
      }
      return res
        .status(200)
        .json({ success: "Course is deleted, Successfully..." });
    } catch (error) {
      console.log(error);
    }
  }
}
const CourseController = new Course();
module.exports = CourseController;
