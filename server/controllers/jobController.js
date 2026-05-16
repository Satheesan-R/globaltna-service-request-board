const JobRequest = require("../models/JobRequest");

// GET all jobs
const getJobs = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// GET single job
const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// POST create job
const createJob = async (req, res, next) => {
  try {
    const { title, description, category, location, address, contactName, contactEmail, phonenumber } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    const newJob = await JobRequest.create({
      title,
      description,
      category,
      location,
      Address: address || '',
      contactName,
      contactEmail,
      phonenumber: phonenumber || ''
    });

    res.status(201).json(newJob);
  } catch (error) {
    next(error);
  }
};

// PATCH update status only
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Open", "In Progress", "Closed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const updatedJob = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// DELETE job
const deleteJob = async (req, res, next) => {
  try {
    const deletedJob = await JobRequest.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob
};