const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportLocationSchema = new Schema({
  latitude: { type: String },
  longitude: { type: String },
  locationName: { type: String },
  blacklist: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("report Location", reportLocationSchema);
