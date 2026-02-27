const BookingOTPModel = require("../../Models/User/BookingOTP");
const userModel = require("../../Models/User/user");
const { default: axios } = require("axios");

class BookingOTP {
  async sendBookingOTP(req, res) {
    let { mobile } = req.body;
    // console.log("mobile", mobile);
    if (!mobile) {
      return res.json({ error: "No Number" });
    } else {
      try {
        let user = await userModel.findOne({ mobile: mobile });
        if (!user) {
          return res
            .status(500)
            .json({ error: "Please enter registred Mobile number" });
        }
        let newnumber = await BookingOTPModel.findOne({ mobile: mobile });
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
              return res.status(500).json({ error: error });
            });
          //
        } else {
          var otp = (Math.floor(Math.random() * 1000000) + 1000000)
            .toString()
            .substring(1);
          console.log(otp);
          let newotp = new BookingOTPModel({
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
            .catch((error) => {
              console.error(error);
              return res.status(500).json({ error: error });
            });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async verifyBookingOTP(req, res) {
    const { otp, mobile } = req.body;
    if (!otp) {
      return res.json({ error: "enter otp" });
    } else {
      try {
        let verify = await BookingOTPModel.findOne({
          otp: otp,
          mobile: mobile,
        });
        if (verify) {
          let user = await userModel.findOneAndUpdate(
            {
              mobile: mobile,
            },
            { status: "online" }
          );
          //   console.log("user", user);
          if (user) {
            return res
              .status(200)
              .json({ success: "otp verified", user: user });
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
}

const authBookingOTPController = new BookingOTP();
module.exports = authBookingOTPController;
