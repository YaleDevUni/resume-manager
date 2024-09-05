const Resume = require('../models/Resume');
const PDF = require('../models/PDF');
const e = require('express');
const User = require('../models/User');

// Upload a bulk of resumes with associated PDFs
exports.createBulkResumes = async (req, res) => {
  try {
    const recruitment_id = req.body.recruitment_id;
    console.log('recruitment_id', recruitment_id);
    const user = User.findById(req.user.userId);
    // console.log('user', user);
    const pdfFiles = req.files.filter(
      file => file.mimetype === 'application/pdf'
    );
    pdfFiles.forEach(async pdf => {
      const pdfDoc = new PDF({
        filename: pdf.originalname,
        data: pdf.buffer,
        contentType: pdf.mimetype,
        uploadedBy: user.id,
      });
      const pdfInMongo = await pdfDoc.save();
      const resume = new Resume({
        name: pdf.originalname,
        createdBy: user._id,
        recruitmentID: recruitment_id,
        resumePDF: pdfInMongo._id,
      });
      await resume.save();
    });
    res.status(201).json({ message: 'Resumes uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload resumes' });
  }
};

// Get all resumes with pagination
exports.getAllResumes = async (req, res) => {
  const recruitmentID = req.query.recruitment_id;
  const user = User.findById(req.user.userId);
  const filter = {}; // filter by different fields
  try {
    // ensure that the query parameters are numbers
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const resumes = await Resume.find({ recruitmentID, createdBy: user._id })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    // .populate('resumePDF');

    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resumes' });
  }
};

// Get a resume by ID and populate the PDF
exports.getResumeById = async (req, res) => {
  const resumeID = req.params.id;
  try {
    const resume = await Resume.findById(resumeID).populate('resumePDF');
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resume' });
  }
};

// Update a resume by ID
exports.updateResumeById = async (req, res) => {
  const resumeID = req.params.id;
  const updates = req.body;
  try {
    // find and check req.user.userId is the creator of the resume
    const resume = await Resume.findById(resumeID);
    if (resume.createdBy.toString() !== req.user.userId) {
      return res
        .status(401)
        .json({ message: 'You are not authorized to update this resume' });
    }
    resume.updateOne(updates);
    res.status(200).json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update resume' });
  }
};

// Delete a resume by ID
exports.deleteResumeById = async (req, res) => {
  const resumeID = req.params.id;
  try {
    const resume = await Resume.findByIdAndDelete(resumeID);
    // check if req.user.userId is the creator of the resume
    if (resume.createdBy.toString() !== req.user.userId) {
      return res
        .status(401)
        .json({ message: 'You are not authorized to delete this resume' });
    }
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resume' });
  }
};

// Bulk update resumes by recruitment ID
