const bcrypt = require("bcryptjs");
const { StudentModel } = require("../../model/studentModel");
const jwt = require("jsonwebtoken");
const { TutorModel } = require("../../model/TutorModel");

// Helper function to create JWT token and session
const createUserSession = (user, req) => {
  const token = jwt.sign(
    {
      id: user._id,
      // name: user.name,
      // phone: user.phone,
    },
    process.env.JWT_SECRET || "jamikhan01786076080",
    { expiresIn: "1d" }
  );

  req.session.token = token;
  req.session.userId = user._id;

  return {
    ...user,
  };
};

// User registration
const registration = async (req, res) => {
  try {
    const { userInfo } = req.body;

    const { role, userDetails } = userInfo;
    const { name, phone, password } = userDetails;

    if (!name || !phone || !password) {
      return res
        .status(400)
        .send({ message: "All fields (name, phone, password) are required." });
    }

    // Check if user already exists
    const existingUser = await StudentModel.findOne({ phone });
    if (existingUser) {
      //   console.log("User already exists");
      return res.status(400).send({
        success: false,
        message: "User already exists with this phone number.",
      });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === "student") {
      console.log(userDetails, "Student registration");

      // create new student
      const newStudent = new StudentModel({
        name,
        phone,
        password: hashedPassword, // store hashed password
      });

      await newStudent.save();
      console.log(newStudent, "Student saved to DB");
      
      const user = {
        _id: newStudent._id,
        name: newStudent.name,
        phone: newStudent.phone,
      };

      const studentData = createUserSession(user, req);

      console.log(studentData, "studentData");

      return res.status(200).send({
        role: "student",
        message: "Student registered successfully.",
        user: studentData,
      });
    } else if (role === "tutor") {
      console.log(userDetails, "Tutor registration");

      // TODO: Implement tutor registration logic
      return res
        .status(200)
        .send({
          success: true,
          message: "Tutor registration is not implemented yet.",
        });
    }

    // If role is invalid
    return res
      .status(400)
      .send({
        success: false,
        message: "Invalid role. Must be 'student' or 'tutor'.",
      });
  } catch (error) {
    console.error("Error in registration:", error);
    res
      .status(500)
      .send({
        success: false,
        message: "Server error during registration.",
        error,
      });
  }
};

const login = async (req, res, next) => {
  try {
    const { userInfo } = req.body;
    // console.log(userInfo, "userInfo");
    const { role, userDetails } = userInfo;

    let existingUser = {};
    // search student from database
    if (role === "student") {
      const { phone, password } = userDetails;
      existingUser = await StudentModel.findOne({ phone });
    }

    // search tutor from database
    if (role === "tutor") {
      const { email, password } = userDetails;
      existingUser = await TutorModel.findOne({ email });
    }

    if (!existingUser) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(
      userDetails?.password,
      existingUser?.password
    );
    if (!isMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid Password" });
    }

    // console.log(existingUser, "user");

    let user = {};
    if (role === "student") {
      user = {
        _id: existingUser._id,
        name: existingUser.name,
        phone: existingUser.phone,
      };
    } else if (role === "tutor") {
      user = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      };
    }

    // Create session and return user data
    const userData = createUserSession(user, req);
    console.log(userData);
    res.send({
      success: true,
      role,
      message: "Logged in successfully",
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registration, login };
