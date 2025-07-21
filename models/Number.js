const mongoose = require("mongoose");
const numberSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdditionalDetails",
  },
  spamScore: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  reportedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Number", numberSchema);
