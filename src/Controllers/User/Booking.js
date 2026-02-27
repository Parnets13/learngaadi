const BookingModel = require("../../Models/User/Booking");
const driverModel = require("../../Models/Driver/driver");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class Booking {
  async addBooking(req, res) {
    try {
      const {
        BookingId,
        // selectedDate,
        Amount,
        GST,
        Discount,
        TotalAmount,
        Name,
        DrivingLicence,
        PracticalDays,
        SimulatorDays,
        TheoryDays,
        CourseCategory,
        userId,
        userName,
        userContactNumber,
        userArea,
        userCity,
        userState,
        userCountry,
        userPincode,
      } = req.body;
      console.log("userId", PracticalDays, SimulatorDays, TheoryDays);

      const newBooking = await BookingModel.create({
        BookingId: BookingId,
        // selectedDate: selectedDate,
        Amount: Amount,
        GST: GST,
        Discount: Discount,
        TotalAmount: TotalAmount,
        Name: Name,
        DrivingLicence: DrivingLicence,
        PracticalDays: PracticalDays,
        SimulatorDays: SimulatorDays,
        TheoryDays: TheoryDays,
        CourseCategory: CourseCategory,
        userId: userId,
        userName: userName,
        userContactNumber: userContactNumber,
        userArea: userArea,
        userCity: userCity,
        userState: userState,
        userCountry: userCountry,
        userPincode: userPincode,
      });
      if (newBooking) {
        return res.status(201).json({ success: "new Booking added..." });
      }
      return res
        .status(400)
        .json({ error: "Something went wrong!!! please try again" });
    } catch (error) {
      console.log(error);
    }
  }

  async getBooking(req, res) {
    try {
      const BookingList = await BookingModel.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "BookingId",
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
          $sort: {
            _id: -1,
          },
        },
      ]);
      if (BookingList?.length > 0) {
        return res.status(200).json({ BookingList: BookingList });
      }
      return res.status(400).json({ BookingList: BookingList });
    } catch (error) {
      console.log(error);
    }
  }

  async getBookingbyCustomerID(req, res) {
    const CustomerId = req.params.id;
    console.log("CustomerId", CustomerId);
    try {
      const BookingList = await BookingModel.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "BookingId",
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
            userId: new ObjectId(CustomerId),
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);
      if (BookingList?.length > 0) {
        return res.status(200).json({ BookingList: BookingList });
      }
      return res.status(500).json({ BookingList: BookingList });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteBooking(req, res) {
    try {
      const Bookingid = req.params?.id;
      if (!Bookingid) {
        return res.status(400).json({ error: "Please provide Booking id" });
      }
      const deleteBooking = await BookingModel.findOneAndDelete({
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

  async AcceptBooking(req, res) {
    const { BookingID, Status, DriverID, AssignedBy, DriverName } = req.body;

    console.log("booking", BookingID, Status);
    try {
      const booking = await BookingModel.findOne({ _id: BookingID });
      if (booking.DriverID) {
        return res.status(500).json({
          error: "Sorry...!, This booking is already accepted by other driver.",
        });
      } else {
        const data = await BookingModel.findOneAndUpdate(
          { _id: BookingID },
          {
            Status: Status,
            DriverID: DriverID,
            AssignedBy: AssignedBy,
            DriverName: DriverName,
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

  async RejectBooking(req, res) {
    const { BookingID, DriverID } = req.body;

    console.log("booking", BookingID, DriverID);
    try {
      const data = await BookingModel.findOneAndUpdate(
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

  async StartTraning(req, res) {
    const { BookingID } = req.body;

    console.log("booking", BookingID);
    try {
      const data = await BookingModel.findOneAndUpdate(
        { _id: BookingID },
        {
          Status: "Ongoing",
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

  async markAttendance(req, res) {
    const { BookingID, Attendance_Date, Attendance_Status, Pause_reason } =
      req.body;
    try {
      const data = await BookingModel.findOneAndUpdate(
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
      const data = await BookingModel.findOneAndUpdate(
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

  async CompleteTraning(req, res) {
    const { BookingID } = req.body;

    console.log("booking", BookingID);
    try {
      const data = await BookingModel.findOneAndUpdate(
        { _id: BookingID },
        {
          Status: "Completed",
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

  async bookingnotification(req, res) {
    const { driverID } = req.params.id;
    try {
      const BookingList = await BookingModel.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "BookingId",
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
      ]);

      const Pendingbookings = await BookingModel.find({
        Status: "Pending",
      });
      const ongoingbookings = await BookingModel.find({
        Status: "Ongoing",
      });

      //Prebooking
      const Confirmedbookings = await BookingModel.find({
        Status: "Confirmed",
      });

      const ongoingDriver = ongoingbookings?.filter(
        (ong) => ong?.DriverID === driverID
      );
      const ConfirmedDriver = ongoingbookings?.filter(
        (ong) => ong?.DriverID === driverID
      );

      const finddriver = await driverModel?.findOne({ _id: driverID });

      for (let i = 0; i < Pendingbookings.length; i++) {
        const xyz = finddriver?.availableSlots?.find(
          (slot) => slot === Pendingbookings[i]?.selectedTime
        );
      }

      const selecteddriver = ongoingbookings.map((book) => {
        for (let i = 0; i < drivers.length; i++) {
          if (book.DriverID === drivers[i]?._id) {
            return drivers[i];
          }
        }
      });

      console.log("BookingList", BookingList, selecteddriver);
      if (BookingList?.length > 0) {
        return res.status(200).json({ BookingList: BookingList });
      }
      return res.status(400).json({ BookingList: BookingList });
    } catch (error) {
      console.log(error);
    }
  }
}
const BookingController = new Booking();
module.exports = BookingController;
