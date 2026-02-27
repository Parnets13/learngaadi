const adminModel = require("../../Models/Admin/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

class admin {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      let check = await adminModel.findOne({ email: email });

      if (check)
        return res.status(400).json({
          error: "Email Id already exist, Please try with another Email ID",
        });

      let encryptedPassword = bcrypt.hash(password, saltRounds).then((hash) => {
        return hash;
      });
      let pwd = await encryptedPassword;

      let obj = { name, email, password: pwd };

      let data = await adminModel.create(obj);
      if (!data) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({ success: "Successfully register" });
    } catch (err) {
      console.log(err);
    }
  }

  async createsubadmin(req, res) {
    try {
      const {
        name,
        email,
        password,
        user,
        Book,
        video,
        audio,
        kids,
        Mpopular,
        Mawaited,
        podcast,
        musictherapy,
        snippets,
        blog,
        subscription,
        accounts,
        contactus,
      } = req.body;

      let check = await adminModel.findOne({ email: email });

      if (check)
        return res.status(400).json({
          error: "Email Id already exist, Please try with another Email ID",
        });

      let encryptedPassword = bcrypt.hash(password, saltRounds).then((hash) => {
        return hash;
      });
      let pwd = await encryptedPassword;

      let obj = {
        name,
        email,
        password: pwd,
        user,
        Book,
        video,
        audio,
        kids,
        Mpopular,
        Mawaited,
        podcast,
        musictherapy,
        snippets,
        blog,
        subscription,
        accounts,
        contactus,
        adminType: "Subadmin",
      };

      let data = await adminModel.create(obj);
      if (!data) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({ success: "Successfully register" });
    } catch (err) {
      console.log(err);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      let check = await adminModel.findOne({ email: email });

      if (!check)
        return res
          .status(400)
          .json({ error: "Please enter Registered Email Id" });

      let compare = await bcrypt
        .compare(password, check.password)
        .then((res) => {
          return res;
        });

      if (!compare) {
        return res.status(400).send({ error: "Incorrect password" });
      }
      return res
        .status(200)
        .json({ msg: "Successfully login", success: check });
    } catch (err) {
      console.log(err);
    }
  }

  async getsubadmin(req, res) {
    try {
      const subadminList = await adminModel.find({ adminType: "Subadmin" });
      if (subadminList?.length > 0) {
        const sortedsubadmin = subadminList.sort(
          (a, b) => b.createdAt - a.createdAt
        );
        return res.status(200).json({ subadminList: sortedsubadmin });
      }
      return res.status(400).json({ subadminList: subadminList });
    } catch (error) {
      console.log(error);
    }
  }

  async editsubadmin(req, res) {
    try {
      const id = req.params?.id;
      const {
        name,
        email,
        password,
        user,
        Book,
        video,
        audio,
        kids,
        Mpopular,
        Mawaited,
        podcast,
        musictherapy,
        snippets,
        blog,
        subscription,
        accounts,
        contactus,
      } = req.body;

      const issubadminpresent = await adminModel.findOne({
        _id: id,
      });
      if (!issubadminpresent) {
        return res.status(400).json({
          error: "subadmin is not present!!! Something went wrong",
        });
      }
      var newpassword = "";
      if (issubadminpresent.password === password) {
        newpassword = password;
      } else {
        let encryptedPassword = bcrypt
          .hash(password, saltRounds)
          .then((hash) => {
            return hash;
          });

        newpassword = await encryptedPassword;
      }
      const editsubadmin = await adminModel.findOneAndUpdate(
        { _id: id },
        {
          name: name,
          email: email,
          password: newpassword,
          user: user,
          Book: Book,
          video: video,
          audio: audio,
          kids: kids,
          Mpopular: Mpopular,
          Mawaited: Mawaited,
          podcast: podcast,
          musictherapy: musictherapy,
          snippets: snippets,
          blog: blog,
          subscription: subscription,
          accounts: accounts,
          contactus: contactus,
        }
      );
      if (!editsubadmin) {
        return res.status(400).json({
          error: "subadmin is not edited, please try again!!!",
        });
      }
      return res
        .status(200)
        .json({ success: "subadmin is edited successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async deletesubadmin(req, res) {
    try {
      const subadminid = req.params?.id;
      if (!subadminid) {
        return res.status(400).json({ error: "Please provide subadmin id" });
      }
      const deletesubadmin = await adminModel.findOneAndDelete({
        _id: subadminid,
      });
      if (!deletesubadmin) {
        return res.status(400).json({ error: "subadmin is not deleted!!!" });
      }
      return res
        .status(200)
        .json({ success: "subadmin is deleted, Successfully..." });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new admin();
