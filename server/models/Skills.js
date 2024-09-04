const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
