const User = require("../models/User");
const AdditionalDetails = require("../models/AdditionalDetails");
const Number=require('../models/Number')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Contact = require("../models/Contact");
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
    const updatedUser=await user.save();
    console.log("details",updatedUser)
    const updatedNumbe=await Number.findByIdAndUpdate(updatedUser.phoneNumber._id,{
      name:details._id
    })
    // Send response only after save
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        additionalDetails: details,
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
  try {
    const userId = req.user.id;

    // 1. Find the user
    const user = await User.findById(userId).select("phoneNumber");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Find all contacts of the user
    const contacts = await Contact.find({ user: userId }).select("phone");
    const contactPhoneIds = contacts.map(contact => contact.phone?.toString());

    // 3. Exclude the user's own phone number from deletion
    const filteredPhoneIds = contactPhoneIds.filter(
      phoneId => phoneId !== user.phoneNumber.toString()
    );

    // 4. Delete contacts
    await Contact.deleteMany({ user: userId });

    // 5. Delete number documents only from contacts (excluding user's number)
    if (filteredPhoneIds.length > 0) {
      await Number.deleteMany({ _id: { $in: filteredPhoneIds } });
    }

    // 6. Delete the user (without touching AdditionalDetails or Number)
    await User.findByIdAndDelete(userId);

    // 7. Clear auth cookie
    res.clearCookie("loginToken");

    return res.status(200).json({
      success: true,
      message: "User deleted successfully. Contacts and related numbers removed",
    });

  } catch (error) {
    console.error("Error deleting user data:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while deleting user",
      error: error.message,
    });
  }
};

