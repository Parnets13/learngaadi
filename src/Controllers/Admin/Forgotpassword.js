const ForgotpasswordModel = require("../../Models/Admin/Forgotpassword");
const axios = require("axios");
const adminModel = require("../../Models/Admin/admin");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

class Forgotpassword {
  async sendOtp(req, res) {
    let { email } = req.body;
    console.log("email", email);
    try {
      async function postmail(data, otp) {
        let data1 = await adminModel.findOne({ email: data?.email });
        if (data1) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "noreplaylearngaadi@gmail.com",
              pass: "ofcu fpif dpde tkpu",
            },
            port: 465,
            host: "gsmtp.gmail.com",
          });

          const mailOptions = {
            from: "noreplaylearngaadi@gmail.com",
            to: data.email,
            subject: "Please verify your OTP - Learn Gaadi",
            html: `<h1>Hi ${data.name},</h1><p>Your OTP number is :</p> <b> ${otp}.</b><p>Thank you for using Learn Gaadi.</p>`,
          };
          console.log("mailOptions", mailOptions);

          if (data1) {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            return true;
          }
        } else {
          return false;
        }
      }
      let checkD = await adminModel.findOne({ email: email });
      if (!checkD) {
        return res
          .status(400)
          .json({ error: "Please enter registered email id" });
      } else {
        let otp = (Math.floor(Math.random() * 1000000) + 1000000)
          .toString()
          .substring(1);
        let presentMobile = await ForgotpasswordModel.findOneAndUpdate(
          { email: email },
          { $set: { EmailOtp: otp } },
          { new: true }
        );
        let newMobile;
        if (!presentMobile) {
          newMobile = new ForgotpasswordModel({
            email,
            EmailOtp: otp,
          });
          await newMobile
            .save()
            .then((data) => {
              if (data) {
                // return res
                //   .status(200)
                //   .json({ success: "Mobile number is added in the DB..." });
                let value = postmail(checkD, otp);
                if (value) {
                  return res.status(200).json({
                    success: email,
                  });
                }
                return res.status(400).json({ error: "Please try again!!!" });
              }
            })
            .catch((err) => {
              return res
                .status(500)
                .json({ error: "Error while adding data to DB.." });
            });
        } else {
          let value = postmail(checkD, otp);
          if (value) {
            return res.status(200).json({
              success: email,
            });
          }
          return res.status(400).json({ error: "Please try again!!!" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "something went wrong" });
    }
  }

  async VerifyOtp(req, res) {
    const { email, otp } = req.body;
    console.log("email, otp", email, otp);
    try {
      let varified = await ForgotpasswordModel.findOne({
        EmailOtp: otp,
        email: email,
      });
      if (!varified) {
        return res.status(400).json({ error: "Invalid OTP" });
      } else {
        let data = await adminModel.findOne({ email: email });
        return res.status(200).json({ msg: "OTP Varified", success: data });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async ChangePassword(req, res) {
    let { AdminId, password } = req.body;
    try {
      let password1 = bcrypt.hashSync(password, 10);
      const user = await adminModel.findOneAndUpdate(
        { _id: AdminId },
        { password: password1 }
      );
      if (user) {
        return res
          .status(200)
          .json({ success: "Password updated successfully" });
      } else {
        return res
          .status(500)
          .json({ error: "Error: Please try after some time" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const ForgotpasswordController = new Forgotpassword();
module.exports = ForgotpasswordController;
