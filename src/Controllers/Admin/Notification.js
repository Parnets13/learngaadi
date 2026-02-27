const NotificationModel = require("../../Models/Admin/Notification");
const driverModel = require("../../Models/Driver/driver");
const userModel = require("../../Models/User/user");
const parse = require("html-react-parser");

// firebase connection
const FCM = require("fcm-node");
const fcmDriver = new FCM(
  "AAAAyXT-r_Q:APA91bE_D00b263NrkR22fELOQu8T1haUQGlwhLXjVEMm5JE4_TwqGKlabIq88xAdovrPhz5tWQGV6o9wXnkb-mD8_ac3M774dPyHU2IzhkdSKwNmOxGGky9_H_fVZ-pB6iU8yxdvna0"
);
const fcmUser = new FCM(
  "AAAAXwXe-nY:APA91bE0sOb1Xfm6z7DJfxYWSmB66MOC5ZyAsn9Kry_zsaoWRhrO9rjn238p7qIZBesg6PFcENkymVUgzDQOunGTo2Kp6Ug4BZSCJbBxPVHO0USDjFGOM5zuspm1HMrR33kp5yfRPuAJ"
);

function sendMessage(fcm, message) {
  return new Promise((resolve, reject) => {
    fcm.send(message, (err, response) => {
      if (err) {
        console.error("Failed to send message:", message, err);
        reject(err);
      } else {
        console.log("Successfully sent message:", response);
        resolve(response);
      }
    });
  });
}

class Notification {
  // async addNotification(req, res) {
  //   try {
  //     const { NotificationFor, notification } = req.body;
  //     console.log("asxas", NotificationFor, notification);
  //     if (!NotificationFor || !notification) {
  //       return res
  //         .status(500)
  //         .json({ error: "please provide Notification name" });
  //     } else {
  //       const newNotification = await NotificationModel.create({
  //         NotificationFor: NotificationFor,
  //         notification: notification,
  //       });
  //       if (NotificationFor === "Users") {
  //         const users = await userModel.find({});
  //         console.log("users", users);
  //         for (const user of users) {
  //           console.log("user.token", user.token);
  //           const message = {
  //             token: user.token, // Assuming `user` has a `token` field
  //             notification: {
  //               title: "New Notification from Learn Gaadi",
  //               body: notification, // `notification` should be defined elsewhere in your code
  //             },
  //             data: {
  //               title: "New Notification from Learn Gaadi",
  //               body: notification,
  //             },
  //           };
  //           fcmUser.send(message, (err, response) => {
  //             console.log("message", message, err, response);
  //             if (err) {
  //               console.log("Something has gone wrong!", err);
  //             } else {
  //               console.log("Successfully sent with response: ", response);
  //             }
  //           });
  //         }
  //       } else if (NotificationFor === "Drivers") {
  //         const drivers = await driverModel.find({});

  //         for (const driver of drivers) {
  //           const message = {
  //             token: driver.token, // Assuming `driver` has a `token` field
  //             notification: {
  //               title: `New Notification from Learn Gaadi`,
  //               body: notification, // `notification` should be defined elsewhere in your code
  //             },
  //             data: {
  //               title: "New Notification from Learn Gaadi",
  //               body: notification,
  //             },
  //           };

  //           fcmDriver.send(message, (err, response) => {
  //             if (err) {
  //               console.log("Something has gone wrong!", err);
  //             } else {
  //               console.log("Successfully sent with response: ", response);
  //             }
  //           });
  //         }
  //       }

  //       if (newNotification) {
  //         return res.status(201).json({ success: "new Notification added..." });
  //       }
  //       return res
  //         .status(400)
  //         .json({ error: "Something went wrong!!! please try again" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async addNotification(req, res) {
    try {
      const { NotificationFor, notification } = req.body;

      if (!NotificationFor || !notification) {
        return res
          .status(400)
          .json({ error: "Please provide Notification name" });
      }

      const newNotification = await NotificationModel.create({
        NotificationFor: NotificationFor,
        notification: notification,
      });

      if (NotificationFor === "Users") {
        const users = await userModel.find({});
        for (const user of users) {
          if (user.token) {
            const message = {
              to: user.token,
              notification: {
                title: "New Notification from Learn Gaadi",
                // body: parse(notification),
                body: notification,
              },
              data: {
                title: "New Notification from Learn Gaadi",
                // body: parse(notification),
                body: notification,
                targetUrl: "Notification",
              },
            };
            // await sendMessage(fcmUser, message);
          }
        }
      } else if (NotificationFor === "Drivers") {
        const drivers = await driverModel.find({});
        for (const driver of drivers) {
          if (driver.token) {
            const message = {
              to: driver.token,
              notification: {
                title: "New Notification from Learn Gaadi",
                body: notification,
              },
              data: {
                title: "New Notification from Learn Gaadi",
                body: notification,
                targetUrl: "Notification",
              },
            };
            // await sendMessage(fcmDriver, message);
          }
        }
      }
      return res.status(201).json({ success: "New Notification added..." });
    } catch (error) {
      console.error("Error adding notification:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong! Please try again" });
    }
  }

  async getNotification(req, res) {
    try {
      const NotificationList = await NotificationModel.find({}).sort({
        _id: -1,
      });
      if (NotificationList?.length > 0) {
        return res.status(200).json({ NotificationList: NotificationList });
      }
      return res.status(400).json({ NotificationList: NotificationList });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteNotification(req, res) {
    try {
      const Notificationid = req.params?.id;
      if (!Notificationid) {
        return res
          .status(400)
          .json({ error: "Please provide Notification id" });
      }
      const deleteNotification = await NotificationModel.findOneAndDelete({
        _id: Notificationid,
      });
      if (!deleteNotification) {
        return res
          .status(400)
          .json({ error: "Notification is not deleted!!!" });
      }
      return res
        .status(200)
        .json({ success: "Notification is deleted, Successfully..." });
    } catch (error) {
      console.log(error);
    }
  }
}
const NotificationController = new Notification();
module.exports = NotificationController;
