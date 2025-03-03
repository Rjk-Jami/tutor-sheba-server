const mongoose = require("mongoose");
const tuitionSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => generateJobId(),
    },
    title: { type: String, required: true, trim: true },

    location: {
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
        required: true,
      },
      Location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
    },

    medium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mediums",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },

    student: {
      gender: { type: String, enum: ["Male", "Female"], required: true },
      count: { type: Number, min: 1, default: 1 },
    },

    tutor: {
      preferredGender: {
        type: String,
        enum: ["Male", "Female", "All"],
        required: true,
      },
    },

    tutoring: {
      days: { type: Number, required: true, min: 1, max: 7 },
      specificDays: [
        {
          type: String,
          enum: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
        },
      ],
      time: { type: String, trim: true },
      duration: { type: String, trim: true },
    },

    subject: {
      type: [String],
      required: true,
      validate: (v) => v.length > 0,
    },

    salary: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "Tk", trim: true },
      period: {
        type: String,
        default: "Month",
        enum: ["Day", "Week", "Month", "Year"],
      },
    },
    tuitionTypes: {
      type: String,
      enum: ['homeTuition', 'onlineTuition', "allTuition"], 
      required: true, 
    },

    requirements: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Active", "Filled", "Expired", "Cancelled"],
      default: "Active",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Function to generate 4-digit jobId
const generateJobId = async () => {
    const latestJob = await Tuition.findOne().sort({ jobId: -1 }); // Find the latest jobId
    const lastJobId = latestJob ? parseInt(latestJob.jobId) : 0; // If no jobId exists, start from 0
    const newJobId = (lastJobId + 1).toString().padStart(4, '0'); // Increment and pad to 4 digits
    return newJobId;
  };

const TuitionList = mongoose.model("TuitionList", tuitionSchema);

module.exports = { TuitionList };
