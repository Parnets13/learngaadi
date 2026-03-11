const OtpLoginModel = require("../../Models/Driver/OtpLogin");
const driverModel = require("../../Models/Driver/driver");
const { default: axios } = require("axios");

class OtpLogin {
  async sendotp(req, res) {
    let { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }
    
    try {
      let driver = await driverModel.findOne({ mobile: mobile });
      
      // Check if driver exists
      if (!driver) {
        console.log("Driver not found for mobile:", mobile);
        return res.status(404).json({ 
          error: "Driver not registered. Please complete registration first.",
          needsRegistration: true 
        });
      }
      
      console.log("Driver found:", driver.name, driver.mobile);
        
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
        var otp = "123456"; // Fixed OTP for testing
          console.log("Generated OTP:", otp);
          let newotp = new OtpLoginModel({
            mobile,
            otp,
          });
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
              try {
                save = await newotp.save();
                if (save) {
                  console.log("OTP saved despite SMS failure:", otp);
                  return res.status(200).json({
                    success: "otp sent successfully",
                    otp: otp,
                    mobile: mobile,
                  });
                } else {
                  return res.status(500).json({ error: "Failed to save OTP" });
                }
              } catch (saveError) {
                console.error("Error saving OTP:", saveError);
                return res.status(500).json({ error: "Failed to generate OTP" });
              }
            });
        }
    } catch (err) {
      console.error("Error in sendotp:", err);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: err.message 
      });
    }
  }

  async verifyotp(req, res) {
    const { otp, mobile, token } = req.body;
    console.log("Verifying OTP - Mobile:", mobile, "OTP:", otp, "Token:", token);
    
    if (!otp) {
      return res.status(400).json({ error: "Please enter OTP" });
    }
    
    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }
    
    try {
      let verify = await OtpLoginModel.findOne({
        otp: otp,
        mobile: mobile,
      });
      
      console.log("OTP verification result:", verify ? "Found" : "Not found");
      
      if (verify) {
        let driver = await driverModel.findOneAndUpdate(
          { mobile: mobile },
          { status: "online", token: token },
          { new: true } // Return updated document
        );
        
        console.log("Driver update result:", driver ? driver.name : "Not found");
        
        if (driver) {
          return res.status(200).json({ 
            success: "OTP verified successfully", 
            driver: driver 
          });
        } else {
          return res.status(404).json({ 
            error: "Driver not found. Please register first.",
            needsRegistration: true
          });
        }
      } else {
        return res.status(400).json({
          error: "Invalid OTP. Please enter the correct OTP sent to your mobile number",
        });
      }
    } catch (err) {
      console.error("Error in verifyotp:", err);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: err.message 
      });
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
