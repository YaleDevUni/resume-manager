const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema(
  {
    recruitmentID: {
      type: String,
      required: true,
      unique: true,
    },
    skillsToMatch: {
      type: [String], // Array of skills required for the position
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Recruitment = mongoose.model('Recruitment', recruitmentSchema);

module.exports = Recruitment;
