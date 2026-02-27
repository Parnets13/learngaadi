const userModel = require("../../Models/User/user");

class User {
  async UserSignup(req, res) {
    try {
      let profilepic;
      req.files.map((item) => {
        if (item.fieldname === "profilepic") {
          profilepic = item.filename;
        }
      });
      const { name, mobile, Address, Area, City, State, Country, Pincode } =
        req.body;
      console.log("newwdata", req.body);
      const data = await userModel.findOne({ mobile: mobile });
      if (data) {
        return res.status(300).json({
          error:
            "Entered Mobile No. is already registered. Please try with another Mobile No.",
        });
      }
      if (!profilepic) {
        return res.status(400).json({ error: "please provide profile image" });
      } else {
        const newUser = await userModel.create({
          profilepic: profilepic,
          name: name,
          mobile: mobile,
          Address: Address,
          Area: Area,
          City: City,
          State: State,
          Country: Country,
          Pincode: Pincode,
        });
        if (newUser) {
          return res.status(200).json({ success: "success", data: newUser });
        }
        return res
          .status(400)
          .json({ error: "Something went wrong!!! please try again" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async userUpdate(req, res) {
    let Aadharcard;
    req.files.map((item) => {
      if (item.fieldname === "Aadharcard") {
        Aadharcard = item.filename;
      }
    });
    const { userId } = req.body;
    try {
      const data = await userModel.findOneAndUpdate(
        { _id: userId },
        { Aadharcard: Aadharcard }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.status(200).json({ success: "Successfully registered" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async userSignout(req, res) {
    let signout = req.params.id;
    try {
      await userModel
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

  async getalluser(req, res) {
    let user = await userModel.find({}).sort({ _id: -1 });
    if (user) {
      return res.json({ user: user });
    } else {
      return res.status(403).json({ error: "No User exist" });
    }
  }

  // user block statement

  async userblock(req, res) {
    let user = req.params.userid;
    try {
      const data = await userModel.findOneAndUpdate(
        { _id: user },
        { blockstatus: true }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.status(200).json({ success: "Blocked Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }
  // user unblock statement

  async userunblock(req, res) {
    let user = req.params.id;
    try {
      const data = await userModel.findOneAndUpdate(
        { _id: user },
        { blockstatus: false }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Unblocked Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async editprofile(req, res) {
    let { userID, name, mobile, Address, Area, City, State, Country, Pincode } =
      req.body;

    let obj = {
      name,
      mobile,
      Address,
      Area,
      City,
      State,
      Country,
      Pincode,
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
      }
    }
    try {
      let updateuser = await userModel.findOneAndUpdate(
        { _id: userID },
        { $set: obj },
        { new: true }
      );

      if (updateuser) {
        return res
          .status(200)
          .json({ success: "profile added successfully", user: updateuser });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const userauthontroller = new User();
module.exports = userauthontroller;
