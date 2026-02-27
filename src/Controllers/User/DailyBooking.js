const DailyBookingModel = require("../../Models/User/DailyBooking");
const BookingModel = require("../../Models/User/Booking");
const driverModel = require("../../Models/Driver/driver");
const userModel = require("../../Models/User/user");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// firebase connection
const admin = require("firebase-admin");
const serviceAccount = require("../../../serivceAccountkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "learngadi-64516",
});

// const FCM = require("fcm-node");
// const fcmDriver = new FCM(
//   "AAAAyXT-r_Q:APA91bE_D00b263NrkR22fELOQu8T1haUQGlwhLXjVEMm5JE4_TwqGKlabIq88xAdovrPhz5tWQGV6o9wXnkb-mD8_ac3M774dPyHU2IzhkdSKwNmOxGGky9_H_fVZ-pB6iU8yxdvna0"
// );
// const fcmUser = new FCM(
//   "AAAAXwXe-nY:APA91bE0sOb1Xfm6z7DJfxYWSmB66MOC5ZyAsn9Kry_zsaoWRhrO9rjn238p7qIZBesg6PFcENkymVUgzDQOunGTo2Kp6Ug4BZSCJbBxPVHO0USDjFGOM5zuspm1HMrR33kp5yfRPuAJ"
// );

// function sendMessage(fcm, message) {
//   return new Promise((resolve, reject) => {
//     fcm.send(message, (err, response) => {
//       if (err) {
//         console.error("Failed to send message:", message, err);
//         reject(err);
//       } else {
//         console.log("Successfully sent message:", response);
//         resolve(response);
//       }
//     });
//   });
// }

async function sendMessage(DriversdeviceToken, userDeviceID) {
  try {
    const message = {
      // token: userDeviceID,
      token: DriversdeviceToken,
      notification: {
        title: "New Notification from Learn Gaadi",
        body: "New booking request from Learn Gaadi",
      },
      data: {
        title: "New Notification from Learn Gaadi",
        body: "New booking request from Learn Gaadi",
      },
    };

    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error; // Ensure error is propagated up for better error handling
  }
}

class DailyBooking {
  async addDailyBooking(req, res) {
    try {
      const {
        MainBookingId,
        CourseId,
        CourseCategory,
        StartAddress,
        latitute,
        logitute,
        SelectedTime,
        BookingDate,
        Amount,
        GST,
        Discount,
        TotalAmount,
        Name,
        userId,
        userName,
        userContactNumber,
        userArea,
        userCity,
        userState,
        userCountry,
        userPincode,
        userDeviceID,
      } = req.body;

      const newBooking = await DailyBookingModel.create({
        MainBookingId: MainBookingId,
        CourseId: CourseId,
        CourseCategory: CourseCategory,
        StartAddress: StartAddress,
        latitute: latitute,
        logitute: logitute,
        SelectedTime: SelectedTime,
        BookingDate: BookingDate,
        Amount: Amount,
        GST: GST,
        Discount: Discount,
        TotalAmount: TotalAmount,
        Name: Name,
        userId: userId,
        userName: userName,
        userContactNumber: userContactNumber,
        userArea: userArea,
        userCity: userCity,
        userState: userState,
        userCountry: userCountry,
        userPincode: userPincode,
      });
      const drivers = await driverModel.find({
        DriverDuty: true,
        VehicalType: CourseCategory,
      });
      // console.log("drivers", drivers);
      for (const driver of drivers) {
        if (driver.token) {
          const message = {
            to: driver.token,
            notification: {
              title: "New Notification from Learn Gaadi",
              body: "New booking request from Learn Gaadi",
            },
            data: {
              title: "New Notification from Learn Gaadi",
              body: "New booking request from Learn Gaadi",
            },
          };
          // await sendMessage(driver.token);
        }
      }

      if (newBooking) {
        return res
          .status(201)
          .json({ success: "new Booking added...", Booking: newBooking });
      }

      return res
        .status(400)
        .json({ error: "Something went wrong!!! please try again" });
    } catch (error) {
      console.log(error);
    }
  }

  async getDailyBooking(req, res) {
    try {
      const BookingList = await DailyBookingModel.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "CourseId",
            foreignField: "_id",
            as: "courses",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "courses.CourseCategory",
            foreignField: "catName",
            as: "categorie",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $lookup: {
            from: "drivers",
            localField: "DriverID",
            foreignField: "_id",
            as: "drivers",
          },
        },
      ]);
      // console.log("BookingList", BookingList);
      if (BookingList?.length > 0) {
        return res.status(200).json({ BookingList: BookingList });
      }
      return res.status(400).json({ BookingList: BookingList });
    } catch (error) {
      console.log(error);
    }
  }

  async getDailyBookingbyID(req, res) {
    const BookingId = req.params.id;
    console.log("BookingId", BookingId);
    try {
      const BookingList = await DailyBookingModel.findOne({ _id: BookingId });
      if (BookingList) {
        return res.status(200).json({ BookingList: BookingList });
      }
      return res.status(500).json({ BookingList: BookingList });
    } catch (error) {
      console.log(error);
    }
  }

  async getDailyBookingbyMainBookingID(req, res) {
    const BookingId = req.params.id;
    console.log("BookingId", BookingId);
    try {
      const BookingList = await DailyBookingModel.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "CourseId",
            foreignField: "_id",
            as: "courses",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "courses.CourseCategory",
            foreignField: "catName",
            as: "categorie",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $lookup: {
            from: "drivers",
            localField: "DriverID",
            foreignField: "_id",
            as: "drivers",
          },
        },
        {
          $match: {
            MainBookingId: new ObjectId(BookingId),
          },
        },
      ]);

      // const BookingList = await DailyBookingModel.find({
      //   MainBookingId: BookingId,
      // });
      if (BookingList) {
        return res.status(200).json({ BookingList: BookingList });
      }
      return res.status(500).json({ BookingList: BookingList });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDailyBooking(req, res) {
    try {
      const Bookingid = req.params?.id;
      if (!Bookingid) {
        return res.status(400).json({ error: "Please provide Booking id" });
      }
      const deleteBooking = await DailyBookingModel.findOneAndDelete({
        _id: Bookingid,
      });
      if (!deleteBooking) {
        return res.status(400).json({ error: "Booking is not deleted!!!" });
      }
      return res
        .status(200)
        .json({ success: "Booking is deleted, Successfully..." });
    } catch (error) {
      console.log(error);
    }
  }

  async AcceptDailyBooking(req, res) {
    const {
      BookingID,
      Status,
      DriverID,
      AssignedBy,
      DriverName,
      Driverlatitude,
      Driverlongitude,
    } = req.body;

    console.log("booking", BookingID, Status);
    try {
      const booking = await DailyBookingModel.findOne({ _id: BookingID });
      if (booking.DriverID) {
        return res.status(500).json({
          error: "Sorry...!, This booking is already accepted by other driver.",
        });
      } else {
        const data = await DailyBookingModel.findOneAndUpdate(
          { _id: BookingID },
          {
            Status: Status,
            DriverID: DriverID,
            AssignedBy: AssignedBy,
            DriverName: DriverName,
            Driverlatitude: Driverlatitude,
            Driverlongitude: Driverlongitude,
          }
        );
        if (!data) {
          return res.status(403).json({
            error: "Cannot able to find the Booking",
          });
        } else {
          return res
            .status(200)
            .json({ success: "Successfully updated", Booking: data });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async RejectDailyBooking(req, res) {
    const { BookingID, DriverID } = req.body;

    console.log("booking", BookingID, DriverID);
    try {
      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: BookingID },
        {
          $push: { Rejected_Driver_ID: DriverID },
        }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async StartDailyBooking(req, res) {
    const { BookingID, Driverlatitude, Driverlongitude } = req.body;

    console.log("booking", BookingID, Driverlatitude, Driverlongitude);
    try {
      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: BookingID },
        {
          Status: "Ongoing",
          Driverlatitude: Driverlatitude,
          Driverlongitude: Driverlongitude,
        }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateDriverAddress(req, res) {
    const { BookingID, Driverlatitude, Driverlongitude } = req.body;

    try {
      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: BookingID },
        {
          Driverlatitude: Driverlatitude,
          Driverlongitude: Driverlongitude,
        }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async markAttendanceDailyBooking(req, res) {
    const { BookingID, Attendance_Date, Attendance_Status, Pause_reason } =
      req.body;
    try {
      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: BookingID },
        {
          $push: {
            Attendance: {
              Attendance_Date: Attendance_Date,
              Attendance_Status: Attendance_Status,
              Pause_reason: Pause_reason,
            },
          },
        },
        { new: true }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async ExtendTraning(req, res) {
    const { BookingID, No_Days } = req.body;

    console.log("booking", BookingID);
    try {
      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: BookingID },
        { $inc: { Extended_Days: No_Days } },
        { new: true } // to return the updated document
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async StartTraining(req, res) {
    const { BookingID, DailyBookingID, DriverMobile, startkm } = req.body;

    console.log("booking", BookingID, DailyBookingID);
    try {
      const dailybooking = await DailyBookingModel.findOne({
        MainBookingId: BookingID,
      });
      const user = await userModel.findOne({ _id: dailybooking.userId });

      // console.log("dailybooking", dailybooking);
      // console.log("user", user);

      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: DailyBookingID },
        {
          Status: "Started",
          DriverMobile: DriverMobile,
          startkm: startkm,
        }
      );

      if (user.token) {
        const message = {
          to: user.token,
          notification: {
            title: "New Notification from Learn Gaadi",
            body: "Training Started successfully",
          },
          data: {
            title: "New Notification from Learn Gaadi",
            body: "Training Started successfully",
          },
        };
        // await sendMessage(fcmUser, message);
      }

      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async CompleteTraning(req, res) {
    const {
      BookingID,
      TrainingTime,
      DailyBookingID,
      DriverID,
      DriverName,
      DriverMobile,
      AssignedBy,
      BookingTime,
      Attendance_Date,
      endkm,
    } = req.body;

    console.log("booking", BookingID, TrainingTime, DailyBookingID);
    try {
      const dailybooking = await DailyBookingModel.findOne({
        MainBookingId: BookingID,
      });
      const user = await userModel.findOne({ _id: dailybooking.userId });

      // console.log("dailybooking", dailybooking);
      // console.log("user", user);
      const existingData = await DailyBookingModel.findOne({
        _id: DailyBookingID,
      });
      const Dbstartkm = existingData.startkm;
      const TotalKm = endkm - Dbstartkm;

      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: DailyBookingID },
        {
          Status: "Completed",
          TrainingTime: TrainingTime,
          endkm: endkm,
          TotalKm: Math.abs(TotalKm),
        }
      );

      if (user.token) {
        const message = {
          to: user.token,
          notification: {
            title: "New Notification from Learn Gaadi",
            body: "Training completed successfully",
          },
          data: {
            title: "New Notification from Learn Gaadi",
            body: "Training completed successfully",
          },
        };
        // await sendMessage(fcmUser, message);
      }

      const book = await BookingModel.findOneAndUpdate(
        {
          _id: BookingID,
        },
        {
          $push: {
            Attendance: {
              Attendance_Date: Attendance_Date,
              Attendance_Status: "Completed",
              TrainingTime: TrainingTime,
              DriverID: DriverID,
              DriverName: DriverName,
              DriverMobile: DriverMobile,
              AssignedBy: AssignedBy,
              BookingTime: BookingTime,
              endkm: endkm,
            },
          },
        },
        { new: true }
      );
      console.log("book", book);

      if (
        book?.Attendance?.length ===
        book?.PracticalDays + book?.SimulatorDays + book?.TheoryDays
      ) {
        const book1 = await BookingModel.findOneAndUpdate(
          {
            _id: BookingID,
          },
          {
            Status: "Completed",
          }
        );
      }

      if (!data && !book) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async Addreview(req, res) {
    const { DailyBookingID, CustomerReview } = req.body;

    console.log("booking", DailyBookingID);
    try {
      const data = await DailyBookingModel.findOneAndUpdate(
        { _id: DailyBookingID },
        {
          CustomerReview: CustomerReview,
        }
      );

      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the Booking",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", Booking: data });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
const DailyBookingController = new DailyBooking();
module.exports = DailyBookingController;
