const Resume = require('../models/Resume');
const PDF = require('../models/PDF');
const User = require('../models/User');
const PdfService = require('../service/pdfToText.js');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const crypto = require('crypto');
require('dotenv').config();

// Function to save PDF to the database or retrieve existing one
async function saveOrRetrievePDF(pdf, user) {
  const md5 = crypto.createHash('md5').update(pdf.buffer).digest('hex');
  let pdfInMongo = await PDF.findOne({ md5 });

  if (!pdfInMongo) {
    const pdfDoc = new PDF({
      md5,
      filename: pdf.originalname,
      data: pdf.buffer,
      contentType: pdf.mimetype,
      uploadedBy: user,
    });
    pdfInMongo = await pdfDoc.save();
  }

  return pdfInMongo;
}

// Function to generate AI response
async function generateAIResponse(allPdfs) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            order: { type: SchemaType.NUMBER },
            applicant: { type: SchemaType.STRING },
            skills: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            education: {
              type: SchemaType.OBJECT,
              properties: {
                degree: { type: SchemaType.STRING },
                major: { type: SchemaType.STRING },
                school: { type: SchemaType.STRING },
                graduationYear: { type: SchemaType.STRING },
              },
            },
            contact: {
              type: SchemaType.OBJECT,
              properties: {
                email: { type: SchemaType.STRING },
              },
            },
          },
        },
      },
    },
  });

  const prompt =
    'Convert resumes to list of json. Each resume have resume(n) at top of the resume.\n' +
    allPdfs;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

// Function to create resume documents
async function createResumeDocuments(resumesData, pdfsOnDB, user, recruitment) {
  const resumePromises = resumesData.map(async (resume, index) => {
    const resumeDoc = new Resume({
      name: resume.applicant || 'Unknown',
      createdBy: user,
      recruitment,
      resumePDF: pdfsOnDB[index]._id,
      education: resume.education || {},
      contact: resume.contact || {},
      skills: resume.skills
        ? resume.skills.map(skill => skill.toLowerCase().replace(/[.,]/g, ''))
        : [],
    });
    await resumeDoc.save();
  });

  await Promise.all(resumePromises);
}

// Controller to handle bulk resume upload
exports.createBulkResumes = async (req, res) => {
  try {
    const { recruitment } = req.body;
    const user = await User.findById(req.user.userId);
    const pdfService = new PdfService();
    const pdfFiles = req.files.filter(
      file => file.mimetype === 'application/pdf'
    );

    const allPdfs = [];
    const pdfsOnDB = [];

    for (let index = 0; index < pdfFiles.length; index++) {
      const pdf = pdfFiles[index];
      const pdfText = await pdfService.extractTextFromPdf(pdf);
      pdfText.unshift(`resume${index + 1}\n`);
      allPdfs.push(pdfText.join(' '));
      const pdfInMongo = await saveOrRetrievePDF(pdf, user);
      pdfsOnDB.push(pdfInMongo);
    }

    const resumesData = await generateAIResponse(allPdfs.join(' '));
    await createResumeDocuments(resumesData, pdfsOnDB, user, recruitment);

    res.status(201).json({ message: 'Resumes uploaded successfully' });
  } catch (error) {
    console.error('Error uploading resumes:', error);
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
      .skip((page - 1) * limit)
      .populate({
        path: 'recruitment',
        select: 'title position',
      });

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
