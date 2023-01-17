const express = require("express");
const app = express();
const port = 8081;
const bodyparser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var validator = require("email-validator");
const SECRET_KEY = "ahmermalik";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/Exercise-Tracking")
  .then(() => {
    console.log("connection made");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  track: [
    {
      Date: { type: String },
      Type: { type: String },
      Duration: { type: String },
      Comments: { type: String },
    },
  ],
});
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    next(); // now save method will be called
  } catch (err) {
    console.log("You are having an error " + err);
  }
});
const User = mongoose.model("User", userSchema);
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
app.use(cors({ origin: "*" }));
app.post("/", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res
        .status(400)
        .json({ email: " A user has already listed with this email" });
    } else {
      if (
        req.body.firstName === "" ||
        req.body.password === "" ||
        req.body.email === ""
      ) {
        res.send("Please fill all fields");
      }
      if (validator.validate(req.body.email)) {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
        newUser.save();
        let token = null;
        token = jwt.sign(
          {
            fname: newUser.firstName,
            lname: newUser.lastName,
            email: newUser.email,
            track: newUser.track,
          },
          SECRET_KEY,
          { expiresIn: "10h" }
        );
        return res.status(200).json({
          success: true,
          message: "User has been registered",
          data: newUser,
          token,
        });
      } else res.send("Invalid email");
    }
  });
});
app.post("/LogIn", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      const hash = user.password;
      bcrypt.compare(req.body.password, hash, function (err, result) {
        if (result) {
          token = jwt.sign(
            {
              fname: user.firstName,
              lname: user.lastName,
              email: user.email,
              track: user.track,
            },
            SECRET_KEY,
            { expiresIn: "10h" }
          );
          return res.status(200).json({
            success: true,
            message: "Logged In succesfully",
            token: token,
          });
        } else {
          res.json({ success: false, message: "Incorrect Password" });
        }
      });
    })
    .catch(() => {
      res.json({ success: false, message: "Not valid email" });
    });
});
app.get("/Profile", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res
      .status(200)
      .json({ success: false, message: "Error! token not provided" });
  }
  const decodedToken = jwt.verify(token, SECRET_KEY);
  return res.status(200).json({
    success: true,
    data: {
      fname: decodedToken.fname,
      lname: decodedToken.lname,
      email: decodedToken.email,
      track: decodedToken.track,
    },
  });
});
app.post("/EditProfile", (req, res) => {
  User.updateOne(
    { email: req.body.email },
    {
      $set: {
        firstName: req.body.newfname,
        lastName: req.body.newlname,
        email: req.body.newEmail,
      },
    }
  )
    .then(() => {
      User.findOne({ email: req.body.newEmail }).then((user) => {
        token = jwt.sign(
          {
            fname: user.firstName,
            lname: user.lastName,
            email: user.email,
            track: user.track,
          },
          SECRET_KEY,
          { expiresIn: "10h" }
        );
        return res.status(200).json({
          success: true,
          message: "Profile Updated successfully",
          token: token,
        });
      });
    })
    .catch(() => {
      res.send("there was some issue");
    });
});
app.post("/Resetpswd", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    const hash = user.password;
    bcrypt.compare(req.body.password, hash, async function (err, result) {
      if (result) {
        let newpswd = req.body.newPassword;
        newpswd = await bcrypt.hash(newpswd, 10);
        User.updateOne(
          { email: req.body.email },
          {
            $set: {
              password: newpswd,
            },
          }
        )
          .then(() => {
            return res.status(200).json({
              success: true,
              message: "Password updated successfully",
            });
          })
          .catch(() => {
            res.send("there was some issue");
          });
      } else {
        res.json({ success: false, message: "Wrong Password" });
      }
    });
  });
});
app.post("/workout", (req, res) => {
  User.updateOne(
    { email: req.body.email },
    {
      $push: {
        track: {
          Date: req.body.Date,
          Type: req.body.Type,
          Duration: req.body.Duration,
          Comments: req.body.Comments,
        },
      },
    }
  )
    .then(() => {
      User.findOne({ email: req.body.email }).then((user) => {
        token = jwt.sign(
          {
            fname: user.firstName,
            lname: user.lastName,
            email: user.email,
            track: user.track,
          },
          SECRET_KEY,
          { expiresIn: "10h" }
        );
        return res.status(200).json({
          success: true,
          message: "Exercise added successfully",
          token: token,
        });
      });
    })
    .catch(() => {
      res.send("there was some issue");
    });
});
app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
