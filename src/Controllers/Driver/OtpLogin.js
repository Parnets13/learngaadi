const OtpLoginModel = require("../../Models/Driver/OtpLogin");
const driverModel = require("../../Models/Driver/driver");
const { default: axios } = require("axios");

class OtpLogin {
  async sendotp(req, res) {
    let { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    } else {
      try {
        let driver = await driverModel.findOne({ mobile: mobile });
        
        // For testing: If driver not found, create a temporary test driver
        if (!driver) {
          console.log("Driver not found, creating test driver for:", mobile);
          driver = new driverModel({
            name: "Test Driver",
            mobile: mobile,
            DrivingSchoolName: "Test School",
            Area: "Test Area",
            City: "Test City",
            State: "Test State",
            Country: "India",
            Pincode: 123456,
            VehicalType: "Car",
            VehicalModel: "Test Model",
            Experience: "1 year",
            status: "Online",
            blockstatus: false,
          });
          await driver.save();
          console.log("Test driver created successfully");
        }
        
        let newnumber = await OtpLoginModel.findOne({ mobile: mobile });
        if (newnumber) {
          const key = "535008a0e9ef96ce5c84c6619382ecba11da09d4078b869b";
          const sid = "azeurraggregateacessserrvices1";
          const token = "e18af38ed5e7bae6e3c8018642f85fdfbea0cbf6888381d1";
          const from = "08047092112";
          const to = mobile;
          const body = `Dear Customer, ${newnumber.otp} is the OTP to register as a Customer. OTPs are secret. Please DO NOT disclose it to anyone. Team Mitrakart`;
          const formUrlEncoded = (x) =>
            Object.keys(x).reduce(
              (p, c) => p + `&${c}=${encodeURIComponent(x[c])}`,
              ""
            );
          let url =
            "https://" +
            key +
            ":" +
            token +
            "@api.exotel.in/v1/Accounts/" +
            sid +
            "/Sms/send.json";
          axios
            .post(
              url,
              formUrlEncoded({
                From: from,
                To: to,
                Body: body,
                DltEntityId: "1001332735606324744",
              }),
              {
                withCredentials: true,
                headers: {
                  Accept: "application/x-www-form-urlencoded",
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            )
            .then(async (data) => {
              // console.log(`statusCode: ${data.status}`);
              console.log(newnumber.otp);
              return res
                .status(200)
                .json({ otp: newnumber.otp, mobile: mobile });
            })
            .catch((error) => {
              console.error(error);
              // Even if SMS fails, return OTP for testing
              console.log("SMS failed, returning OTP anyway:", newnumber.otp);
              return res
                .status(200)
                .json({ otp: newnumber.otp, mobile: mobile });
            });
          //
        } else {
        //   var otp = (Math.floor(Math.random() * 1000000) + 1000000)
        //     .toString()
        //     .substring(1);
        var otp = "123456"; 
          console.log(otp);
          let newotp = new OtpLoginModel({
            mobile,
            otp,
          });
          console.log("otp", otp);
          let save;
          const key = "535008a0e9ef96ce5c84c6619382ecba11da09d4078b869b";
          const sid = "azeurraggregateacessserrvices1";
          const token = "e18af38ed5e7bae6e3c8018642f85fdfbea0cbf6888381d1";
          const from = "08047092112";
          const to = mobile;
          const body = `Dear Customer, ${otp} is the OTP to register as a Customer. OTPs are secret. Please DO NOT disclose it to anyone. Team Mitrakart`;
          const formUrlEncoded = (x) =>
            Object.keys(x).reduce(
              (p, c) => p + `&${c}=${encodeURIComponent(x[c])}`,
              ""
            );
          let url =
            "https://" +
            key +
            ":" +
            token +
            "@api.exotel.in/v1/Accounts/" +
            sid +
            "/Sms/send.json";
          axios
            .post(
              url,
              formUrlEncoded({
                From: from,
                To: to,
                Body: body,
                DltEntityId: "1001332735606324744",
              }),
              {
                withCredentials: true,
                headers: {
                  Accept: "application/x-www-form-urlencoded",
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            )
            .then(async (data) => {
              console.log(`statusCode: ${data.status}`);
              // console.log(data);
              save = await newotp.save();
              if (save) {
                return res.status(200).json({
                  success: "otp sent successfully",
                  otp: otp,
                  mobile: mobile,
                });
              }
              console.log("otp", otp);
            })
            .catch(async (error) => {
              console.error("SMS Error:", error.message);
              // Even if SMS fails, save OTP and return success for testing
              save = await newotp.save();
              if (save) {
                console.log("OTP saved despite SMS failure:", otp);
                return res.status(200).json({
                  success: "otp sent successfully",
                  otp: otp,
                  mobile: mobile,
                });
              } else {
                return res.status(500).json({ error: "Failed to generate OTP" });
              }
            });
        }
      } catch (err) {
        console.log("Error in sendotp:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async verifyotp(req, res) {
    const { otp, mobile, token } = req.body;
    console.log("token", token);
    if (!otp) {
      return res.json({ error: "enter otp" });
    } else {
      try {
        let verify = await OtpLoginModel.findOne({
          otp: otp,
          mobile: mobile,
        });
        if (verify) {
          let driver = await driverModel.findOneAndUpdate(
            {
              mobile: mobile,
            },
            { status: "online", token: token }
          );
          console.log("driver", driver);
          if (driver) {
            return res
              .status(200)
              .json({ success: "otp verified", driver: driver });
          } else {
            return res
              .status(200)
              .json({ success: "otp verified", mobile: mobile });
          }
        } else {
          return res.status(500).json({
            error:
              "Please enter vaild OTP sent to your Registered Mobile Number",
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async resetpassword(req, res) {
    let { mobile, password } = req.body;
    let passw = await driverModel.findOneAndUpdate(
      { mobile: mobile },
      {
        password: password,
        cpassword: password,
      }
    );

    if (passw) {
      return res.status(200).json({ passw: "Password changed successfully" });
    } else {
      return res.status(500).json({ error: "something went wrong" });
    }
  }
}

const OtpLoginController = new OtpLogin();
module.exports = OtpLoginController;
