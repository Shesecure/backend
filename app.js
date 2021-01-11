const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { permit } = require("./middleware/authrization");

const usersRoutes = require("./Routes/User-routes");

const HttpError = require("./model/http-error");

mongoose
  .connect(
    "mongodb+srv://women-safety:womensafety99$@cluster0.fgowr.mongodb.net/women-safety?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error", err.message);
  });

mongoose.set("useFindAndModify", false);
//mongoose.set("useFindAndDelete", true);

const app = express();

//to handel CORS ERROR
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requseted-With, Content-Type, Accept , Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");

  next();
});

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/users", usersRoutes);
app.use("/api/admin", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

var port = process.env.PORT || 5001;

app.listen(port, function () {
  console.log(`Listening on Port ${port}`);
});

// app.listen(process.env.PORT||5001);
