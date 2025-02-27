const bcrypt = require("bcryptjs");
const { StudentModel } = require("../../model/studentModel");
const jwt = require("jsonwebtoken");


// Helper function to create JWT token and session
const createUserSession = (student, req) => {
    const token = jwt.sign(
      {
        id: student._id,
        name: student.name,
        phone: student.phone,
      },
      process.env.JWT_SECRET || "jamikhan01786076080",
      { expiresIn: "1d" },
    )
  
    req.session.token = token
    req.session.userId = student._id
  
    return {
        id: student._id,
        name: student.name,
        phone: student.phone,
    }
  }
const registration = async (req, res) => {
  try {
    const { userInfo } = req.body;

    const { role, userDetails } = userInfo;
    const { name, phone, password } = userDetails;

    if (!name || !phone || !password) {
      return res
        .status(400)
        .json({ message: "All fields (name, phone, password) are required." });
    }

    // Check if user already exists
    const existingUser = await StudentModel.findOne({ phone });
    if (existingUser) {
    //   console.log("User already exists");
      return res
        .status(400)
        .send({
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
      
      const student = {
        _id: newStudent._id,
        name: newStudent.name,
        phone: newStudent.phone,}

      const studentData = createUserSession(student, req)
      
        
        
    console.log(studentData, "studentData")


      return res
        .status(200)
        .send({
          role: "student",
          message: "Student registered successfully.",
          user: studentData,
        });
    } else if (role === "tutor") {
      console.log(userDetails, "Tutor registration");

      // TODO: Implement tutor registration logic
      return res
        .status(200)
        .send({ message: "Tutor registration is not implemented yet." });
    }

    // If role is invalid
    return res
      .status(400)
      .send({ message: "Invalid role. Must be 'student' or 'tutor'." });
  } catch (error) {
    console.error("Error in registration:", error);
    res
      .status(500)
      .send({ message: "Server error during registration.", error });
  }
};

module.exports = { registration };
