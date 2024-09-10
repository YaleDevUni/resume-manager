const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
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
    recruitment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruitment',
      required: true,
    },
    position: {
      type: String,
      // required: true,
    },
    sharedWith: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    note: {
      type: String,
      default: '',
    },
    rating: {
      type: Number, // Assuming rating is a numeric value
      min: 0,
      max: 10, // Example range
      default: 0,
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
      // one-to-one relationship with the PDF model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PDF', // Reference to the PDF model
      required: true, // Assuming the PDF is mandatory
    },

    education: {
      degree: {
        type: String,
      },
      major: {
        type: String,
      },
      school: {
        type: String,
      },
      graduationYear: {
        type: String,
      },
    },
    contact: {
      email: {
        type: String,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// auto-populate recruitment
const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = Resume;
