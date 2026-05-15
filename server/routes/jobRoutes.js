const express = require("express");
const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob
} = require("../controllers/jobController");

// GET all jobs + POST new job
router.route("/")
  .get(getJobs)
  .post(createJob);

// GET single + PATCH + DELETE
router.route("/:id")
  .get(getJobById)
  .patch(updateJobStatus)
  .delete(deleteJob);

module.exports = router;