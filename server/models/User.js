const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); // Auth strategy

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    // No need for password field, handled by passport-local-mongoose
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.hash;
        delete ret.salt;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.hash;
        delete ret.salt;
        return ret;
      },
    },
  }
);

// Apply passportLocalMongoose plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
