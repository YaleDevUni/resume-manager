const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    skillsToMatch: {
      type: [String], // Array of skills required for the position
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && new Set(v).size === v.length;
        },
        message: 'Skills must be unique',
      },
    },
    position: {
      type: String,
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
recruitmentSchema.virtual('applicants', {
  ref: 'Resume',
  localField: '_id',
  foreignField: 'recruitment',
  count: true, // This tells Mongoose to return the count instead of the documents
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

recruitmentSchema.index({ title: 1, user: 1 }, { unique: true });

const Recruitment = mongoose.model('Recruitment', recruitmentSchema);

module.exports = Recruitment;
