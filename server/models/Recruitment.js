const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema(
  {
    recruitmentID: {
      type: String,
      required: true,
    },
    skillsToMatch: {
      type: [String], // Array of skills required for the position
      required: true,
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User', // Assuming you have a User model
    //   required: true,
    // },
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

// virtual property to count the number of applicants
recruitmentSchema
  .virtual('applicants', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'recruitment',
    count: true,
  })
  .get(function (value) {
    return value || 0; // Ensure 0 is returned if no applicants are found
  });

// Apply virtuals to the schema
recruitmentSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  id: false,
});
recruitmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  id: false,
});

recruitmentSchema.index({ recruitmentID: 1, user: 1 }, { unique: true });

const Recruitment = mongoose.model('Recruitment', recruitmentSchema);

module.exports = Recruitment;
