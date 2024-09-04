const Resume = require('../models/Resume');
const PDF = require('../models/PDF');
const e = require('express');

// Create a new resume with an associated PDF
exports.createResume = async (req, res) => {
  try {
    const {
      name,
      createdBy,
      recruitmentID,
      position,
      note,
      rating,
      skills,
      isPreferred,
      resumePDFData,
    } = req.body;

    // Create the PDF document first
    const pdf = new PDF({
      filename: `${name}_resume.pdf`,
      data: resumePDFData, // Expecting base64 encoded data from the request
      contentType: 'application/pdf',
      uploadedBy: createdBy,
    });

    await pdf.save();

    // Create the Resume document
    const resume = new Resume({
      name,
      createdBy,
      recruitmentID,
      position,
      note,
      rating,
      skills,
      isPreferred,
      resumePDF: pdf._id,
    });

    await resume.save();

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create resume', error });
  }
};

// Upload a bulk of resumes with associated PDFs
exports.createBulkResumes = async (req, res) => {
  try {
    const {pdfs,recruitment_id} = req.body;
    console.log(pdfs);
    // pdfs.forEach(async pdfData => {
    //   const pdf = new PDF({
    //     filename: pdfData.filename,
    //     data: pdfData.data,
    //     contentType: 'application/pdf',
    //     uploadedBy: req.user.userId,
    //   });
    //   pdf.save();
    // });
    res.status(201).json({ message: 'Resumes uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload resumes' });
  }
};
