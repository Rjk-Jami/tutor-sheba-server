const express = require("express");
const cors = require("cors");
const connectDatabase = require("./database/connectDatabase");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/authRoutes/authRoutes");
const District = require("./model/District");
const Location = require("./model/Location");
const userRoutes = require("./routes/userRoutes/userRoutes");
const MediumModel = require("./model/MediumModel");
const ClassModel = require("./model/ClassModel");
const { TuitionList } = require("./model/TuitionListModel");
require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Database Connection and Server Start
(async () => {
  try {
    await connectDatabase();
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
})();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "jamiKhan",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.SERVER_Database,
      ttl: 3600, // Session expires after 1 hour
      autoRemove: "interval", //  expired sessions are deleted
      autoRemoveInterval: 10, // Cleanup every 10 minutes
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    },
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("Error occurred:", error.stack);
  const message = error.message || "Server Error Occurred";
  const status = error.status || 500;
  res.status(status).json({ success: false, message });
});

app.get("/", async (req, res) => {
//  console.log(await District.find())
//  console.log(await Location.find())
//  console.log(await MediumModel.find())
//  console.log(await ClassModel.find())
 console.log(await TuitionList.find())
res.json(await TuitionList.find())
  // res.send("Hello World!");
});

module.exports = app;
