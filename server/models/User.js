const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    verificationCodeExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.hash;
        delete ret.salt;
        delete ret.verificationCode;
        delete ret.verificationCodeExpires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.hash;
        delete ret.salt;
        delete ret.verificationCode;
        delete ret.verificationCodeExpires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      },
    },
  }
);

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

// Apply passportLocalMongoose plugin with email as the username field
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

module.exports = mongoose.model('User', userSchema);
