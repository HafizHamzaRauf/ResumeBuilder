const User = require("../models/User");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = require("../config/utils").PRIVATE_KEY;
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const loadedUser = await User.findOne({ email })
      .select("email password _id")
      .exec();
    if (!loadedUser) {
      const error = new Error("No User found with this email");
      error.statusCode = 401;
      throw error;
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      loadedUser.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email,
        userId: loadedUser._id.toString(),
      },
      PRIVATE_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token, message: "successfully logged in" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    const error = validationResult(req);
    // VALIDATION OF USER  DATA
    if (!error.isEmpty()) {
      const err = new Error(error.errors[0].msg);
      err.statusCode = 422;
      throw err;
    }
    // VALIDATING WHETHER THE  USER ALREADY EXIST
    const result = await User.findOne({ email: email }).select("email").exec();
    if (result) {
      const err = new Error("User already exist");
      err.statusCode = 422;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    const save = await user.save();
    res
      .status(201)
      .json({ message: "User Created  Successfully", userId: save._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
