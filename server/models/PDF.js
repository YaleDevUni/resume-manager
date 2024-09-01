const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    data: {
      type: Buffer, // Store the PDF as binary data
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const PDF = mongoose.model('PDF', pdfSchema);

module.exports = PDF;
