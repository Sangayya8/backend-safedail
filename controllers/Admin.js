require("dotenv").config();
const User = require("../models/User");
const AdditionalDetails = require("../models/AdditionalDetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const Number = require("../models/Number");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().populate([
      { path: "phoneNumber" },
      { path: "additionalDetails" },
    ]);
    return res.status(200).json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    console.error("get all users Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.spamReports = async (req, res) => {
  try {
    const spamLimit = process.env.SPAM_LIMIT;
    const reports = await Number.find({ spamScore: { $gt: spamLimit } })
      .populate("name")
      .sort({ spamScore: -1 });
    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("get all spam reports Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.blackListUser = async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({
        success: false,
        message: "please enter the number",
      });
    }
    const blackListNumber = await Number.findOne({ number }).populate([
        {path:'name'},
        {path:"reportedBy",select:"-password"}
    ]);
    blackListNumber.blackListed = true;
    const userNumber=await blackListNumber.save();
    const blackListUser = await User.findOne({
      phoneNumber: blackListNumber._id,
    }).populate([
      { path: "additionalDetails" },
    //   {
    //     path: "phoneNumber",
    //     populate: {
    //       path: "reportedBy",
    //     },
    //   },
    ]);
    blackListUser.password = undefined;
    blackListUser.phoneNumber=userNumber
    return res.status(200).json({
      success: true,
      message: `${number} blacklisted Successfully`,
      data: blackListUser,
    });
  } catch (error) {
    console.error("Error in blacklisting User", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
