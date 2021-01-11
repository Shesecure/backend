const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const safetyTipShema = new Schema({
  videoTitle: { type: String },
  videoLink: { type: String },

  // safetyTips: [
  //   {
  //     videoTitle: { type: String },
  //     videoLink: { type: String },
  //   },
  // ],
});

module.exports = mongoose.model("SafetyTips", safetyTipShema);
