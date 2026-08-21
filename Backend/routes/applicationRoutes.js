import express from "express";
import {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, roleMiddleware("jobSeeker"), applyForJob);
router.get("/my", protect, roleMiddleware("jobSeeker"), getMyApplications);

router.get("/:jobId/applications", protect, roleMiddleware("recruiter"), getJobApplications);
router.put("/:id/status", protect, roleMiddleware("recruiter"), updateApplicationStatus);

export default router;
