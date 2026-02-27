const driverModel = require("../../Models/Driver/driver");

class driver {
  async driverSignup(req, res) {
    try {
      let profilepic;
      let Aadharcard;
      let DrivingLicence;

      req.files.map((item) => {
        if (item.fieldname === "profilepic") {
          profilepic = item.filename;
        }
        if (item.fieldname === "Aadharcard") {
          Aadharcard = item.filename;
        }
        if (item.fieldname === "DrivingLicence") {
          DrivingLicence = item.filename;
        }
      });
      const {
        name,
        mobile,
        Area,
        City,
        State,
        Country,
        Pincode,
        VehicalType,
        VehicalModel,
        Experience,
      } = req.body;
      const data = await driverModel.findOne({ mobile: mobile });
      if (data) {
        return res.status(300).json({
          error:
            "Entered Mobile No. is already registered. Please try with another Mobile No.",
        });
      }
      if (!profilepic) {
        return res.status(400).json({ error: "please provide profile image" });
      } else {
        const newdriver = await driverModel.create({
          profilepic: profilepic,
          Aadharcard: Aadharcard,
          DrivingLicence: DrivingLicence,
          name: name,
          mobile: mobile,
          Area: Area,
          City: City,
          State: State,
          Country: Country,
          Pincode: Pincode,
          VehicalType: VehicalType,
          VehicalModel: VehicalModel,
          Experience: Experience,
        });
        if (newdriver) {
          return res.status(200).json({ success: "success", data: newdriver });
        }
        return res
          .status(400)
          .json({ error: "Something went wrong!!! please try again" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async driverUpdate1(req, res) {
    const { driverId, VehicalType, VehicalModel, Experience } = req.body;
    try {
      const data = await driverModel.findOneAndUpdate(
        { _id: driverId },
        {
          VehicalType: VehicalType,
          VehicalModel: VehicalModel,
          Experience: Experience,
        }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the driver",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully registered", data: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async driverUpdate2(req, res) {
    let Aadharcard;
    let DrivingLicence;
    req.files.map((item) => {
      if (item.fieldname === "Aadharcard") {
        Aadharcard = item.filename;
      }
      if (item.fieldname === "DrivingLicence") {
        DrivingLicence = item.filename;
      }
    });
    const { driverId } = req.body;
    try {
      const data = await driverModel.findOneAndUpdate(
        { _id: driverId },
        { Aadharcard: Aadharcard, DrivingLicence: DrivingLicence }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the driver",
        });
      } else {
        return res.status(200).json({ success: "Successfully registered" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async driverUpdate3(req, res) {
    const {
      driverId,
      // MtoF,
      // StoS,
      // sixam_sevenam,
      // sevenam_eightam,
      // eightam_nineam,
      // nineam_tenam,
      // tenam_elevenam,
      // elevenam_twelvepm,
      // twelvepm_onepm,
      // onepm_twopm,
      // twopm_threepm,
      // threepm_fourpm,
      // fourpm_fivepm,
      // fivepm_sixpm,
      // sixpm_sevenpm,
      // sevenpm_eightpm,
      availableSlots,
    } = req.body;

    console.log("availableSlots", driverId, availableSlots);
    try {
      const data = await driverModel.findOneAndUpdate(
        { _id: driverId },
        {
          updateTime: true,
          // MtoF: MtoF,
          // StoS: StoS,
          // sixam_sevenam: sixam_sevenam,
          // sevenam_eightam: sevenam_eightam,
          // eightam_nineam: eightam_nineam,
          // nineam_tenam: nineam_tenam,
          // tenam_elevenam: tenam_elevenam,
          // elevenam_twelvepm: elevenam_twelvepm,
          // twelvepm_onepm: twelvepm_onepm,
          // onepm_twopm: onepm_twopm,
          // twopm_threepm: twopm_threepm,
          // threepm_fourpm: threepm_fourpm,
          // fourpm_fivepm: fourpm_fivepm,
          // fivepm_sixpm: fivepm_sixpm,
          // sixpm_sevenpm: sixpm_sevenpm,
          // sevenpm_eightpm: sevenpm_eightpm,
          availableSlots: availableSlots,
        }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the driver",
        });
      } else {
        return res
          .status(200)
          .json({ success: "Successfully updated", driver: data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async driverSignout(req, res) {
    let signout = req.params.id;
    try {
      await driverModel
        .findOneAndUpdate({ _id: signout }, { status: "Offline" })
        .then((data) => {
          return res.json({ Success: "Signout done successfully" });
        })
        .catch((err) => {
          return res.status({ error: "Something went wrong" });
        });
    } catch (error) {
      console.log(error);
    }
  }

  async getalldriver(req, res) {
    let driver = await driverModel.find({}).sort({ _id: -1 });
    if (driver) {
      return res.json({ driver: driver });
    } else {
      return res.status(403).json({ error: "No driver exist" });
    }
  }

  // driver block statement

  async driverblock(req, res) {
    let driver = req.params.driverid;
    try {
      const data = await driverModel.findOneAndUpdate(
        { _id: driver },
        { blockstatus: true }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the driver",
        });
      } else {
        return res.status(200).json({ success: "Blocked Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }
  // driver unblock statement

  async driverunblock(req, res) {
    let driver = req.params.id;
    try {
      const data = await driverModel.findOneAndUpdate(
        { _id: driver },
        { blockstatus: false }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the driver",
        });
      } else {
        return res.json({ success: "Unblocked Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async editprofile(req, res) {
    let {
      driverID,
      name,
      mobile,
      DrivingSchoolName,
      Area,
      City,
      State,
      Country,
      Pincode,
      VehicalType,
      VehicalModel,
      Experience,
    } = req.body;

    let obj = {
      name,
      mobile,
      DrivingSchoolName,
      Area,
      City,
      State,
      Country,
      Pincode,
      VehicalType,
      VehicalModel,
      Experience,
    };

    if (req?.files?.length != 0) {
      let arr = req.files;
      let i;
      for (i = 0; i < arr?.length; i++) {
        if (arr[i].fieldname == "profilepic") {
          obj["profilepic"] = arr[i].filename;
        }
        if (arr[i].fieldname == "Aadharcard") {
          obj["Aadharcard"] = arr[i].filename;
        }
        if (arr[i].fieldname == "DrivingLicence") {
          obj["DrivingLicence"] = arr[i].filename;
        }
      }
    }
    try {
      let updatedriver = await driverModel.findOneAndUpdate(
        { _id: driverID },
        { $set: obj },
        { new: true }
      );

      if (updatedriver) {
        return res.status(200).json({
          success: "profile added successfully",
          driver: updatedriver,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async editduty(req, res) {
    let { driverID, DriverDuty } = req.body;
    console.log("driverID", driverID, DriverDuty);
    try {
      let updatedriver = await driverModel.findOneAndUpdate(
        { _id: driverID },
        { DriverDuty: DriverDuty }
      );

      if (updatedriver) {
        return res.status(200).json({
          success: "Driver details added successfully",
          driver: updatedriver,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDriver(req, res) {
    try {
      const Id = req.params?.id;
      console.log("Id", Id);

      if (!Id) {
        return res.status(400).json({ error: "Please provide Category id" });
      }
      const deleteDriver = await driverModel.findOneAndDelete({
        _id: Id,
      });
      if (!deleteDriver) {
        return res.status(400).json({ error: "Category is not deleted!!!" });
      }
      return res
        .status(200)
        .json({ success: "Category is deleted, Successfully..." });
    } catch (error) {
      console.log(error);
    }
  }
}

const driverauthontroller = new driver();
module.exports = driverauthontroller;
