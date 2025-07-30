const User = require("../models/User");
const AdditionalDetails = require("../models/AdditionalDetails");
const Number = require("../models/Number");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.reportNumber = async (req, res) => {
  try {
    const { number, tags } = req.body;
    const token =
      req.cookies?.loginToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Please Enter The number",
      });
    }
    const numberExist = await Number.findOne({ number: number });
    if (!numberExist) {
      return res.status(404).json({
        success: false,
        message: "Number Not Found",
      });
    }

    if (tags) {
      const newTags = Array.isArray(tags) ? tags : [tags];

      // Normalize to lowercase and filter out duplicates
      const filteredTags = newTags
        .map((tag) => tag.toLowerCase())
        .filter((tag) => !numberExist.tags.includes(tag)); // only tags not already present

      numberExist.tags.push(...filteredTags);
    }
    const userObjectId = new mongoose.Types.ObjectId(decode.id);
    if (!numberExist.reportedBy.includes(userObjectId)) {
      numberExist.spamScore += 1;
      numberExist.reportedBy.push(decode.id);
    }
    await numberExist.save();
    return res.status(200).json({
      success: true,
      message: `${number} reported successfully`,
    });
  } catch (error) {
    console.log("Failed to Report Number", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To Report",
    });
  }
};
exports.unReportNumber = async (req, res) => {
  try {
    const { number } = req.body;
    const token =
      req.cookies?.loginToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userObjectId = new mongoose.Types.ObjectId(decode.id);

    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Please Enter a number",
      });
    }
    const numberExist = await Number.findOne({ number: number });

    if (!numberExist) {
      return res.status(404).json({
        success: false,
        message: "Number Does Not Exist",
      });
    }

    if (numberExist.reportedBy.some((id) => id.equals(userObjectId))) {
      numberExist.spamScore -= 1;
      numberExist.reportedBy = numberExist.reportedBy.filter(
        (id) => !id.equals(userObjectId)
      );
    }
    await numberExist.save();
    return res.status(200).json({
      success: true,
      message: `${number} unSpammed Successfully`,
    });
  } catch (error) {
    console.log("Failed to Un Spam Number", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To UnSpam",
    });
  }
};
exports.getReportOfNumber = async (req, res) => {
  try {
    const { number } = req.params;
    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Please Enter a number",
      });
    }
    const numberExist = await Number.findOne({ number: number }).populate("name");
    if (!numberExist) {
      return res.status(404).json({
        success: false,
        message: "Number Does Not Exist",
      });
    }

    return res.status(200).json({
        success:true,
        data:{
            userdetails:numberExist.name || "unkonown",
            spamScore:numberExist.spamScore,
            tags:numberExist.tags,
            blackListed:numberExist.blackListed
        }
    })



  } catch (error) {
    console.log("Failed to get Report", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To get report",
    });
  }
};
