import express from "express";
import {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("jobSeeker"), applyForJob);
router.get("/my", authMiddleware, roleMiddleware("jobSeeker"), getMyApplications);

router.get("/:jobId/applications", authMiddleware, roleMiddleware("recruiter"), getJobApplications);
router.put("/:id/status", authMiddleware, roleMiddleware("recruiter"), updateApplicationStatus);

export default router;
