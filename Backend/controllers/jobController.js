import Job from "../models/job.js";

// Create Job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      salary,
      skills,
      jobType,
    } = req.body;

    // Check required fields
    if (
      !title ||
      !company ||
      !description ||
      !location ||
      !salary ||
      !skills
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Create job
    const job = await Job.create({
      title,
      company,
      description,
      location,
      salary,
      skills,
      jobType: jobType || "Full-time",
      postedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.log("Create job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.log("Get jobs error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Single Job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.log("Get job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only job owner can update
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.log("Update job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only job owner can delete
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log("Delete job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};