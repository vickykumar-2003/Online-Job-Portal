import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Apply for a Job (Job Seeker only)
export const applyForJob = async (req, res) => {
    try {
        const { job: jobId, coverLetter } = req.body;

        // Verify job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Since we created a unique index in the model, duplicate creation will throw an error, 
        // but doing an explicit check is better for a friendly error message
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id,
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job",
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: req.user.id,
            coverLetter,
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: newApplication,
        });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job",
            });
        }
        console.log("Apply error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Get My Applications (Job Seeker only)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate({
                path: "job",
                select: "title company location",
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        console.log("Get my applications error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Get Job Applications (Recruiter only)
export const getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Verify job exists and belongs to recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view these applications",
            });
        }

        const applications = await Application.find({ job: jobId })
            .populate("applicant", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        console.log("Get job applications error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Update Application Status (Recruiter only)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!["Pending", "Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const application = await Application.findById(applicationId).populate("job");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        if (application.job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application,
        });
    } catch (error) {
        console.log("Update application error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
