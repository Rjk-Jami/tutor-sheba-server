const { TuitionList } = require("../../model/TuitionListModel");

const getAllTuition = async (req, res) => {
  try {
    const filters = req.query;
    // console.log(filters, "filters");
    const page = parseInt(filters.page);
    const limit = parseInt(filters.limit);

    const result = await getFilledTuitions({
      ...filters,
      pagination: { page, limit },
    });
    return res.status(200).json({
      success: true,
      data: result.tuitions,
      meta: {
        totalTuitions: result.totalTuitions,
        totalPages: result.totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching tuitions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tuitions",
      error: error.message,
    });
  }
};

const getFilledTuitions = async (filters) => {
  const {
    jobId,
    district,
    location,
    medium,
    classOfMedium,
    startDate,
    endDate,
    tuitionTypes,
    tutorPreferenceType,
    pagination: { page, limit },
  } = filters;

  console.log(filters, "filters");
  const query = {};

  if (jobId) query.jobId = jobId;
  if (district && district !== "All") query["location.district"] = district;
  if (location && location !== "All") query["location.Location"] = location;
  if (medium && medium !== "All") query.medium = medium;
  if (classOfMedium && classOfMedium !== "All") query.class = classOfMedium;
  if (tuitionTypes && tuitionTypes !== "allTuition")
    query.tuitionTypes = tuitionTypes;
  if (tutorPreferenceType && tutorPreferenceType !== "All")
    query["tutor.preferredGender"] = tutorPreferenceType;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const totalTuitions = await TuitionList.countDocuments(query);
  const totalPages = Math.ceil(totalTuitions / limit);

  const tuitions = await TuitionList.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("location.district")
    .populate("location.Location")
    .populate("medium")
    .populate("class");
  return { tuitions, totalTuitions, totalPages };
};

module.exports = { getAllTuition };
