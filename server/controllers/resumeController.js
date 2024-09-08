const Resume = require('../models/Resume');
const PDF = require('../models/PDF');
const User = require('../models/User');

// Upload a bulk of resumes with associated PDFs
exports.createBulkResumes = async (req, res) => {
  try {
    const recruitment = req.body.recruitment;
    const user = await User.findById(req.user.userId);
    const pdfFiles = req.files.filter(
      file => file.mimetype === 'application/pdf'
    );
    pdfFiles.forEach(async pdf => {
      const pdfDoc = new PDF({
        filename: pdf.originalname,
        data: pdf.buffer,
        contentType: pdf.mimetype,
        uploadedBy: user,
      });
      const pdfInMongo = await pdfDoc.save();
      const resume = new Resume({
        name: pdf.originalname,
        createdBy: user,
        recruitment,
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
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resumes = await Resume.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resumes' });
  }
};

// Get a resume by ID and populate the PDF
exports.getResumeById = async (req, res) => {
  const resumeID = req.params.id;
  try {
    const resume = await Resume.findByIdAndUpdate(
      resumeID,
      { resumeViewed: true },
      { new: true }
    ).populate('recruitment');
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
    const resume = await Resume.findById(resumeID).populate('recruitment');
    if (resume.createdBy.toString() !== req.user.userId) {
      return res
        .status(401)
        .json({ message: 'You are not authorized to update this resume' });
    }
    // apply updates to the resume
    resume.set(updates);
    await resume.save();
    res.status(200).json(resume);
  } catch (error) {
    console.log(error);
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
