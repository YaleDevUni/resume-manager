const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Under Review', 'Accepted', 'Rejected', 'Interview Scheduled'],
      default: 'Under Review',
    },
    recruitmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruitment',
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    sharedWith: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    note: {
      type: String,
    },
    rating: {
      type: Number, // Assuming rating is a numeric value
      min: 0,
      max: 10, // Example range
    },
    skills: {
      type: [String], // Array of strings for keywords
    },
    isPreferred: {
      type: Boolean,
      default: false,
    },
    resumeViewed: {
      type: Boolean,
      default: false,
    },
    resumePDF: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PDF', // Reference to the PDF model
      required: true, // Assuming the PDF is mandatory
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = Resume;
