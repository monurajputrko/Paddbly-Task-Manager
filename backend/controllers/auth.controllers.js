const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model.js");

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters or more" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "Enter Email" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid!" });
  }

  if (password.length < 6) {
    return res
      .status(403)
      .json({ error: "Password must be at least 6 letters or more" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(500).json({ error: "Email already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new User({ fullname, email, password: hashedPassword });

    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, "shhhhh");
    const dataToSend = {
      email: user.email,
      fullname: user.fullname,
      tasks: user.tasks,
      token,
    };
    return res.status(200).json(dataToSend);
  } catch (error) {
    res
      .status(400)
      .json({ error: "User creation failed", message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error occured while login, Please try again!" });
      }
      if (!result) {
        return res.status(403).json({ error: "Incorrect password!" });
      }

      // Passwords match, create jwt and return user data
      const token = jwt.sign({ userId: existingUser._id }, "shhhhh");
      const dataToSend = {
        email: existingUser.email,
        fullname: existingUser.fullname,
        tasks: existingUser.tasks,
        token,
      };
      return res.status(200).json(dataToSend);
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname) {
      return res.status(400).json({ error: "Fullname is required!" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Example: 10 rounds of hashing
      existingUser.password = hashedPassword;
    }

    existingUser.email = email;
    existingUser.fullname = fullname;
    await existingUser.save();

    return res.status(200).json({
      msg: "User Info Updated Successfully!",
      fullname: existingUser.fullname,
      email: existingUser.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};
