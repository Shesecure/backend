const validationResult = require("express-validator").validationResult;
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const HttpError = require("../model/http-error");
const User = require("../model/User");
const Safety = require("../model/SafetyTips");
const reportLocation = require("../model/reportLocation");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    username,
    phonenumber,
    email,
    password,
    age,
    gender,
    firstname,
    lastname,
  } = req.body;
  console.log(req.body);

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    firstname,
    lastname,
    phonenumber,
    email,
    password: hashedPassword,
    age,
    gender,
  });

  try {
    createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let access_token;

  try {
    access_token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "myprivatekey",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    message: "user created",

    username: createdUser.username,
    firstname: createdUser.firstname,
    lastname: createdUser.lastname,
    phonenumber: createdUser.phonenumber,
    userId: createdUser.id,
    email: createdUser.email,
    //password: createdUser.password,
    age: createdUser.age,
    gender: createdUser.gender,
    access_token: access_token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    res.json({
      success: false,
      data: error,
    });

    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let access_token;
  try {
    access_token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "myprivatekey",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    message: "you are login success fully ",
    username: existingUser.username,
    userId: existingUser.id,
    // role: [existingUser.role],
    email: existingUser.email,
    age: existingUser.age,
    gender: existingUser.gender,
    //password: existingUser.password,

    access_token: access_token,
  });
};

const deleteUsers = async (req, res, next) => {
  const { userId } = req.params;

  let existingUser;
  try {
    existingUser = await User.deleteOne({ _id: userId });
  } catch (err) {
    const error = new HttpError("Delete failed, please try again later.", 500);
    return next(error);
  }
  res.json({ message: "delete user successFully " });
};

const editUser = async (req, res, next) => {
  const id = req.params.userId;
  console.log("id from query", id);

  try {
    editedUser = await User.findOne({ _id: id });
    console.log("user to be edites", editedUser);
  } catch (err) {
    const error = new HttpError("edit user faild.", 500);
    return next(error);
  }

  res.json({
    message: "user to be edited successFully ",

    user: editedUser,
  });
};
const updateUser = async (req, res, next) => {
  const id = req.params.userId;
  console.log("user id chk", id);
  let editData = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phonenumber: req.body.phonenumber,
    age: req.body.age,
    gender: req.body.gender,
  };
  let existingUser;
  try {
    if (id) {
      console.log(" woyyyyyyyyyeee");
      existingUser = await User.updateOne({ _id: id }, { $set: editData });
      console.log(" woyyyyyyyyyeee");
    } else {
      console.log("user not exist");
    }
  } catch (err) {
    const error = new HttpError("edit user faild.", 500);
    return next(error);
  }

  res.json({
    message: "user updated successFully ",

    username: editData.username,
  });
};

const addGuardian = async (req, res, next) => {
  const id = req.params.userId;
  console.log("user id chk", id);

  let existingUser = await User.findById(id);

  try {
    if (existingUser) {
      let guardianDetails = [
        ...existingUser.guardianDetails,
        ...req.body.guardianDetails,
      ];

      existingUser.guardianDetails = guardianDetails;
      await existingUser.save({ runValidators: false });
    }
  } catch (error) {
    return next(error);
  }

  res.json({ user: existingUser });
};

const location = async (req, res, next) => {
  const id = req.params.userId;
  console.log("user id chk", id);

  let existingUser = await User.findById(id);

  try {
    if (existingUser) {
      let currentLocation = { location: req.body.location };

      existingUser.location = currentLocation.location;
      await existingUser.save({ runValidators: false });
    }
  } catch (error) {
    return next(error);
  }

  res.json({ user: existingUser });
};

// const addSafetyTips = async (req, res, next) => {
//   const id = req.params.userId;
//   console.log("user id chk", id);

//   let existingUser = await User.findById(id);

//   try {
//     if (existingUser) {
//       let tipsDetails = [...existingUser.safetyTips, ...req.body.safetyTips];

//       existingUser.safetyTips = tipsDetails;
//       await existingUser.save({ runValidators: false });
//       //return (role = "admin");
//     }
//   } catch (error) {
//     return next(error);
//   }

//   res.json({ user: existingUser });
// };

const addSafetyTips = async (req, res, next) => {
  const id = req.params.userId;
  console.log("user id chk", id);
  const { videoTitle, videoLink } = req.body;

  const createdSafetyTip = new Safety({
    videoLink: videoLink,
    videoTitle: videoTitle,
  });

  await createdSafetyTip.save();
  res.json({ tips: createdSafetyTip });
};

const showSafetyTips = async (req, res, next) => {
  let tips;
  try {
    tips = await Safety.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ tips: tips });
};

const deleteTips = async (req, res, next) => {
  const { tipId } = req.params;

  let existingTip;
  try {
    existingTip = await Safety.deleteOne({ _id: tipId });
  } catch (err) {
    const error = new HttpError("Delete failed, please try again later.", 500);
    return next(error);
  }
  res.json({ message: "delete tip successFully " });
};

const updateTip = async (req, res, next) => {
  const id = req.params.tipId;
  console.log("tip id chk", id);
  let editData = {
    videoLink: req.body.videoLink,
    videoTitle: req.body.videoTitle,
  };
  let existingTip;
  try {
    if (id) {
      console.log(" woyyyyyyyyyeee");
      existingTip = await Safety.updateOne({ _id: id }, { $set: editData });
      console.log(" woyyyyyyyyyeee");
    } else {
      console.log("tip not exist");
    }
  } catch (err) {
    const error = new HttpError("edit tip faild.", 500);
    return next(error);
  }

  res.json({
    message: "Tip updated successFully ",
  });
};

const reportLocations = async (req, res, next) => {
  const id = req.params.userId;
  console.log("user id chk", id);
  const { latitude, longitude, locationName } = req.body;

  const reportedLocation = new reportLocation({
    latitude: latitude,
    longitude: longitude,
    locationName: locationName,
  });

  await reportedLocation.save();
  res.json({ "loction reported": reportedLocation });
};

const showReportedLocations = async (req, res, next) => {
  let reportedLocations;
  try {
    reportedLocations = await reportLocation.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching reported locations failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ "reported locations": reportedLocations });
};

const reportedLocationAction = async (req, res, next) => {
  const id = req.params.locId;
  console.log("user id chk", id);
  let editData = {
    blacklist: req.body.blacklist,
  };
  let existingLocation;
  try {
    if (id) {
      console.log(" woyyyyyyyyyeee");
      existingLocation = await reportLocation.updateOne(
        { _id: id },
        { $set: editData }
      );
      console.log(" woyyyyyyyyyeee");
    } else {
      console.log("location not exist");
    }
  } catch (err) {
    const error = new HttpError("location action failed.", 500);
    return next(error);
  }

  res.json({
    message: "Action Taken Successfully ",
  });
};

const deleteReportedLocation = async (req, res, next) => {
  const { locId } = req.params;

  let existingReportedLocation;
  try {
    existingReportedLocation = await reportLocation.deleteOne({ _id: locId });
  } catch (err) {
    const error = new HttpError("Delete failed, please try again later.", 500);
    return next(error);
  }
  res.json({ message: "reported location deleted successFully " });
};

module.exports = {
  getUsers,
  deleteUsers,
  signup,
  login,
  editUser,
  updateUser,
  addGuardian,
  location,
  addSafetyTips,
  showSafetyTips,
  deleteTips,
  updateTip,
  reportLocations,
  showReportedLocations,
  reportedLocationAction,
  deleteReportedLocation,
};
