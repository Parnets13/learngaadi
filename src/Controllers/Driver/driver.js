const driverModel = require("../../Models/Driver/driver");

class driver {
  async driverSignup(req, res) {
    try {
      console.log("=== Driver Signup Request ===");
      console.log("Body:", req.body);
      console.log("Files:", req.files?.length || 0);
      
      let profilepic;
      let Aadharcard;
      let DrivingLicence;

      if (req.files && req.files.length > 0) {
        req.files.map((item) => {
          console.log("File received:", item.fieldname, item.filename);
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
      }
      
      const {
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
      
      console.log("Parsed data:", { name, mobile, DrivingSchoolName, City, profilepic });
      
      // Validation
      if (!name) {
        console.log("Validation failed: Name missing");
        return res.status(400).json({ error: "Name is required" });
      }
      
      if (!mobile) {
        console.log("Validation failed: Mobile missing");
        return res.status(400).json({ error: "Mobile number is required" });
      }
      
      if (!DrivingSchoolName) {
        console.log("Validation failed: DrivingSchoolName missing");
        return res.status(400).json({ error: "Driving School Name is required" });
      }
      
      if (!Area || !City || !State || !Country || !Pincode) {
        console.log("Validation failed: Address fields missing");
        return res.status(400).json({ error: "Please fill all address fields" });
      }
      
      // Check if mobile already exists
      const data = await driverModel.findOne({ mobile: mobile });
      if (data) {
        console.log("Mobile already registered:", mobile);
        return res.status(400).json({
          error: "Entered Mobile No. is already registered. Please try with another Mobile No.",
        });
      }
      
      // Use default profile pic if not provided
      if (!profilepic) {
        console.log("No profile pic provided, using default");
        profilepic = "default-driver.png";
      }
      
      // Create driver
      const newdriver = await driverModel.create({
        profilepic: profilepic,
        Aadharcard: Aadharcard,
        DrivingLicence: DrivingLicence,
        name: name,
        mobile: mobile,
        DrivingSchoolName: DrivingSchoolName,
        Area: Area,
        City: City,
        State: State,
        Country: Country,
        Pincode: Pincode,
        VehicalType: VehicalType,
        VehicalModel: VehicalModel,
        Experience: Experience,
        status: "Online",
        blockstatus: false,
        DriverDuty: false,
      });
      
      if (newdriver) {
        console.log("✅ Driver created successfully:", newdriver._id);
        return res.status(200).json({ 
          success: "Driver registered successfully", 
          data: newdriver 
        });
      }
      
      console.log("Failed to create driver");
      return res.status(400).json({ error: "Something went wrong! Please try again" });
    } catch (error) {
      console.error("❌ Error in driverSignup:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: error.message 
      });
    }
  }

  async driverUpdate1(req, res) {
    const { driverId, VehicalType, VehicalModel, Experience } = req.body;
    
    console.log("Driver update 1 request:", { driverId, VehicalType });
    
    try {
      if (!driverId) {
        return res.status(400).json({ error: "Driver ID is required" });
      }
      
      const data = await driverModel.findOneAndUpdate(
        { _id: driverId },
        {
          VehicalType: VehicalType,
          VehicalModel: VehicalModel,
          Experience: Experience,
        },
        { new: true }
      );
      
      if (!data) {
        return res.status(404).json({
          error: "Cannot find the driver",
        });
      }
      
      console.log("Driver updated successfully:", data._id);
      return res.status(200).json({ 
        success: "Successfully updated", 
        data: data 
      });
    } catch (err) {
      console.error("Error in driverUpdate1:", err);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: err.message 
      });
    }
  }

  async driverUpdate2(req, res) {
    try {
      let Aadharcard;
      let DrivingLicence;
      
      if (req.files && req.files.length > 0) {
        req.files.map((item) => {
          if (item.fieldname === "Aadharcard") {
            Aadharcard = item.filename;
          }
          if (item.fieldname === "DrivingLicence") {
            DrivingLicence = item.filename;
          }
        });
      }
      
      const { driverId } = req.body;
      
      console.log("Driver update 2 request:", { driverId, Aadharcard, DrivingLicence });
      
      if (!driverId) {
        return res.status(400).json({ error: "Driver ID is required" });
      }
      
      const data = await driverModel.findOneAndUpdate(
        { _id: driverId },
        { Aadharcard: Aadharcard, DrivingLicence: DrivingLicence },
        { new: true }
      );
      
      if (!data) {
        return res.status(404).json({
          error: "Cannot find the driver",
        });
      }
      
      console.log("Driver documents updated successfully:", data._id);
      return res.status(200).json({ 
        success: "Documents uploaded successfully",
        data: data
      });
    } catch (err) {
      console.error("Error in driverUpdate2:", err);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: err.message 
      });
    }
  }

  async driverUpdate3(req, res) {
    const { driverId, availableSlots } = req.body;

    console.log("Driver update 3 request:", { driverId, availableSlots });
    
    try {
      if (!driverId) {
        return res.status(400).json({ error: "Driver ID is required" });
      }
      
      const data = await driverModel.findOneAndUpdate(
        { _id: driverId },
        {
          updateTime: true,
          availableSlots: availableSlots,
        },
        { new: true }
      );
      
      if (!data) {
        return res.status(404).json({
          error: "Cannot find the driver",
        });
      }
      
      console.log("Driver slots updated successfully:", data._id);
      return res.status(200).json({ 
        success: "Successfully updated", 
        driver: data 
      });
    } catch (err) {
      console.error("Error in driverUpdate3:", err);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: err.message 
      });
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
    try {
      let driver = await driverModel.find({}).sort({ _id: -1 });
      if (driver) {
        return res.json({ driver: driver });
      } else {
        return res.status(200).json({ driver: [] });
      }
    } catch (error) {
      console.log('getalldriver error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch drivers',
        message: error.message 
      });
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
