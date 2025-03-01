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
    if (!role) {
      // If role is invalid
      return res.status(400).send({
        success: false,
        message: "Invalid role. Must be 'student' or 'tutor'.",
      });
    }
    let existingUser = {};
    const salt = await bcrypt.genSalt(10);
    let userData = {};
    if (role === "student") {
      const { name, phone, password } = userDetails;

      if (!name || !phone || !password) {
        return res.status(400).send({
          message: "All fields (name, phone, password) are required.",
        });
      }
      // Check if user already exists
      existingUser = await StudentModel.findOne({ phone });
      if (existingUser) {
        //   console.log("User already exists");
        return res.status(400).send({
          success: false,
          message: "User already exists with this phone number.",
        });
      }
      // Hash password before saving

      const hashedPassword = await bcrypt.hash(password, salt);

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

      userData = createUserSession(user, req);

      console.log(userData, "userData");
    } else if (role === "tutor") {
      const {
        name,
        email,
        phone,
        gender,
        district,
        location,
        preferredArea,
        password,
      } = userDetails;

      // console.log(
      //   name,
      //   email,
      //   phone,
      //   gender,
      //   district,
      //   location,
      //   preferredArea,
      //   password,
      //   "userDetails"
      // );

      if (
        !name ||
        !email ||
        !phone ||
        !gender ||
        !district ||
        !location ||
        !preferredArea ||
        !password
      ) {
        return res.status(400).send({
          message:
            "All fields (name, email, phone, gender, district, location, preferredArea, password) are required.",
        });
      }
      // Check if user already exists
      existingUser = await TutorModel.findOne({ email });
      if (existingUser) {
        //   console.log("User already exists");
        return res.status(400).send({
          success: false,
          message: "Tutor already exists with this email.",
        });
      }
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(
        name,
        email,
        phone,
        gender,
        district,
        location,
        preferredArea,
        hashedPassword,
        "userDetails"
      );

      // create new Tutor
      const newTutor = new TutorModel({
        name,
        email,
        phone,
        gender,
        district,
        location,
        preferredArea,
        password: hashedPassword, // store hashed password
      });
      await newTutor.save();
      // console.log(newTutor, "Tutor saved to DB");

      // destructure newTutor
      const user = {
        _id: newTutor._id,
        name: newTutor.name,
        email: newTutor.email,
        phone: newTutor.phone,
        gender: newTutor.gender,
        district: newTutor.district,
        location: newTutor.location,
        preferredArea: newTutor.preferredArea,
      };

      userData = createUserSession(user, req);
      console.log(userData, "userData");
    }
    return res.status(200).send({
      success: true,
      role: role,
      message: "User registered successfully.",
      user: userData,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).send({
      success: false,
      message: "Server error during registration.",
      error,
    });
  }
};




// Login
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
        phone: existingUser.phone,
        gender: existingUser.gender,
        district: existingUser.district,
        location: existingUser.location,
        preferredArea: existingUser.preferredArea,
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
