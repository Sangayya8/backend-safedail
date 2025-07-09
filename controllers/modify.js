const User = require("../models/User");
const AdditionalDetails = require("../models/AdditionalDetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.editFunc = async (req, res) => {
  try {
    // const token =
    //   req.cookies.loginToken ||
    //   req.header("Authorization")?.replace("Bearer ", "") ||
    //   req.body.token;

    // if (!token) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Please login first",
    //   });
    // }

    // const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = req.user.id;

    const user = await User.findById(userId).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { email, password, additionalDetails } = req.body;
    let accessToken;

    if (email) {
      user.email = email;

      // Create new token with updated email
      const payload = {
        email,
        id: user._id,
        accountType: user.accountType,
      };

      const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      res.clearCookie("loginToken");

      res.cookie("loginToken", newToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
      accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: "15min",
          });
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }
    let details = null;
    if (additionalDetails) {
      const { name, address } = additionalDetails;
      if (user.additionalDetails) {
        const updatedDetails = await AdditionalDetails.findByIdAndUpdate(
          user.additionalDetails,
          {
            name: name,
            address: address,
          },
          { new: true }
        );
        details = updatedDetails;
      } else {
        const newDetails = await AdditionalDetails.create({ name, address });
        user.additionalDetails = newDetails._id;
        details = newDetails;
      }
    }

    // Save updated user
    await user.save();

    // Send response only after save
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        details: details,
        accessToken,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteFunc = async (req, res) => {
  // const token =
  //   req.cookies.loginToken ||
  //   req.body.token ||
  //   req.header("Authorization")?.replace("Bearer ", "");

  // if (!token) {
  //   console.log("token not present ");
  //   return res.status(401).json({
  //     success: false,
  //     message: "please Log in First",
  //   });
  // }
  try {
    // const jwt_secret = process.env.JWT_SECRET;
    // const decode = jwt.verify(token, jwt_secret);
    const id = req.user.id;
    const user = await User.findById(id);
    await AdditionalDetails.findByIdAndDelete(user.additionalDetails);
    await User.findByIdAndDelete(id);
    res.clearCookie("loginToken");
    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log("error in decoding token " + error);
    return res.status(401).json({
      success: false,
      message: "token is invalid",
    });
  }
};
