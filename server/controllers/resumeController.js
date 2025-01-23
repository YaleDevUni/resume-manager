const Resume = require('../models/Resume');
const PDF = require('../models/PDF');
const User = require('../models/User');
const PdfService = require('../service/pdfToText.js');
const crypto = require('crypto');
const NodeCache = require('node-cache');
const skillsCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const Skills = require('../models/Skills');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const exp = require('constants');
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
// Function to get skills from cache or database
async function getSkillsList() {
  let skills = skillsCache.get('allSkills');
  if (!skills) {
    // If skills are not in cache, fetch from database
    skills = await Skills.find({}, { skill: 1, type: 1, _id: 0 });
    skillsCache.set('allSkills', skills);
  }
  return skills;
}
async function parseSkills(pdfText) {
  try {
    const skills = await getSkillsList();
    const foundSkills = new Set();
    const normalizedText = pdfText.toLowerCase();

    // Add some debug logging

    for (const data of skills) {
      const skillVariations = [
        data.skill.toLowerCase(),
        data.skill.toLowerCase().replace(/\./g, ''),
        data.skill.toLowerCase().replace(/js$/i, 'javascript'),
        data.skill.toLowerCase() + '.js',
        data.skill.toLowerCase().replace(/^c\+\+$/i, 'cpp'),
        data.skill.toLowerCase().replace(/^c#$/i, 'csharp'),
      ];
      for (const variation of skillVariations) {
        const regex = new RegExp(`\\b${variation}\\b`, 'i');
        if (regex.test(normalizedText)) {
          // Changed from skills.skill to data.skill
          foundSkills.add(data.skill);
          break;
        }
      }
    }

    // Add debug logging

    return Array.from(foundSkills);
  } catch (error) {
    console.error('Error extracting skills:', error);
    return [];
  }
}
exports.createBulkResumes = async (req, res) => {
  try {
    const { recruitment } = req.body;
    const user = await User.findById(req.user.userId);
    const pdfService = new PdfService();
    const pdfFiles = req.files.filter(
      file => file.mimetype === 'application/pdf'
    );

    for (let index = 0; index < pdfFiles.length; index++) {
      const pdf = pdfFiles[index];
      const pdfText = await pdfService.extractTextFromPdf(pdf);
      const skills = await parseSkills(pdfText);
      const pdfInMongo = await saveOrRetrievePDF(pdf, user);

      const resumeDoc = new Resume({
        originalFileName: pdf.originalname,
        recruitment: recruitment,
        createdBy: user,
        resumePDF: pdfInMongo._id,
        skills,
      });

      await resumeDoc.save();
    }

    res.status(201).json({
      message: 'Resumes uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading resumes:', error);
    res.status(500).json({ message: 'Failed to upload resumes' });
  }
};
// Get all resumes with query filters
exports.getAllResumes = async (req, res) => {
  try {
    // Parse query parameters with default values
    const page = parseInt(req.query.currentPage, 10) || 1;
    const limit = parseInt(req.query.pagination, 10) || 10;
    const originalFileName = req.query.originalFileName
      ? Array.isArray(req.query.originalFileName)
        ? req.query.originalFileName
        : [req.query.originalFileName]
      : [];
    const recruitments = req.query.recruitments
      ? Array.isArray(req.query.recruitments)
        ? req.query.recruitments
        : [req.query.recruitments]
      : [];
    const skills = req.query.skills
      ? Array.isArray(req.query.skills)
        ? req.query.skills
        : [req.query.skills]
      : [];
    let rating = req.query.rating ? parseInt(req.query.rating, 10) : 0;
    const status = req.query.status ? req.query.status : 'All';
    const showOnlyPreference = req.query.showOnlyPreference === 'true';
    const sortConfig = req.query.sortConfig || '';
    // Parse sort configuration
    let sortStage = {};
    if (sortConfig) {
      const [field, direction] = sortConfig.split('_');
      switch (field) {
        case 'fileName':
          sortStage = {
            $sort: { originalFileName: direction === 'asc' ? 1 : -1 },
          };
          break;
        case 'rating':
          sortStage = { $sort: { rating: direction === 'asc' ? 1 : -1 } };
          break;
        case 'date':
          sortStage = { $sort: { createdAt: direction === 'asc' ? 1 : -1 } };
          break;
        default:
          sortStage = { $sort: { createdAt: -1 } }; // Default sort
      }
    }

    // Adjust rating if necessary
    if (rating === 1) rating = 0;

    // Build match conditions based on filters
    const matchConditions = {
      ...(originalFileName.length > 0
        ? { originalFileName: { $in: originalFileName } }
        : {}),
      ...(skills.length > 0 ? { skills: { $all: skills } } : {}),
      ...(rating > 0 ? { rating: { $gte: rating } } : {}),
      ...(showOnlyPreference ? { isPreferred: true } : {}),
      ...(status !== 'All' && status !== 'null' ? { status } : {}),
      createdBy: new mongoose.Types.ObjectId(req.user.userId),
    };

    // Construct the aggregation pipeline
    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'recruitments',
          localField: 'recruitment',
          foreignField: '_id',
          as: 'recruitment',
          pipeline: [
            {
              $project: {
                title: 1,
                position: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$recruitment',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Additional filtering based on recruitments if provided
      ...(recruitments.length > 0
        ? [
            {
              $match: {
                'recruitment.title': { $in: recruitments },
              },
            },
          ]
        : []),
      {
        $project: {
          originalFileName: 1,
          rating: 1,
          status: 1,
          resumeViewed: 1,
          isPreferred: 1,
          createdAt: 1,
          'recruitment.title': 1,
          'recruitment.position': 1,
        },
      },
      // Add sort stage if sorting is specified
      ...(Object.keys(sortStage).length > 0 ? [sortStage] : []),
      // Facet for pagination
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
      {
        $unwind: '$totalCount',
      },
      {
        $project: {
          data: 1,
          totalCount: '$totalCount.count',
        },
      },
    ];

    const result = await Resume.aggregate(pipeline);

    const resumes = result.length > 0 ? result[0].data : [];
    const totalCount = result.length > 0 ? result[0].totalCount : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: resumes,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages: totalPages,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch resumes' });
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
    // .populate('resumePDF');
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resume' });
  }
};

exports.getPdfById = async (req, res) => {
  const pdfID = req.params.id;
  try {
    const pdf = await PDF.findById(pdfID);
    // Send the buffer data directly, not as JSON
    res.set('Content-Type', 'application/pdf');
    res.send(pdf.data); // Assuming 'data' is the buffer field
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pdf' });
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

// Get all resumes.names from resumes with regex search case insensitive
exports.getAllResumesNamesForSearch = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const resumes = await Resume.aggregate([
      {
        $match: {
          createdBy: user._id,
          originalFileName: { $regex: new RegExp(req.query.q, 'i') },
        },
      },
      {
        $group: {
          _id: '$originalFileName',
        },
      },
      {
        $project: {
          _id: 0,
          originalFileName: '$_id',
        },
      },
    ]);
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resumes' });
  }
};
