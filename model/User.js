const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String },
  gender: { type: String, default: "female" },
  phonenumber: { type: String },
  guardianDetails: [
    {
      mobileNo1: { type: String },
      mobileNo2: { type: String },
      guardianEmail: { type: String },
    },
  ],
  location: [
    {
      latitude: { type: String },
      longitude: { type: String },
      locationName: { type: String },
    },
  ],
  // safetyTips: [
  //   {
  //     videoTitle: { type: String },
  //     videoLink: { type: String },
  //   },
  // ],
  // role: {
  //   type: String,
  //   default: "user",
  //   enum: ["user", "admin"],
  // },
  // songs: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)
