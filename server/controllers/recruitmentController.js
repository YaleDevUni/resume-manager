const Recruitment = require('../models/Recruitment');
const User = require('../models/User');
// CREATE - Add a new recruitment
const handleError = (error, res) => {
  if (error.code === 11000) {
    // Handle duplicate key error
    res.status(400).json({ message: 'The Recruitment ID already exist.' });
  } else if (error.name === 'ValidationError') {
    // Handle validation errors
    const messages = Object.values(error.errors).map(val => val.message);
    res.status(400).json({ message: messages.join('. ') });
  } else {
    // Handle other types of errors
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createRecruitment = async (req, res) => {
  try {
    const recruitment = new Recruitment(req.body);
    const user = await User.findById(req.user.userId);
    recruitment.createdBy = user._id.toString();
    const savedRecruitment = await recruitment.save();
    res.status(201).json(savedRecruitment);
  } catch (error) {
    handleError(error, res);
  }
};

// READ - Get all recruitments with pagination
exports.getAllRecruitments = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const { page = 1, limit = 10 } = req.query;

    const recruitments = await Recruitment.find({ createdBy: user._id })
      .select('_id recruitmentID createdAt')
      .populate('createdBy')
      .limit(limit * 1) // Convert limit to number and limit the results
      .skip((page - 1) * limit) // Skip the number of documents for pagination
      .sort({ createdAt: -1 }) // Sort by date in descending order
      .exec();

    // Get total documents for pagination calculation

    const count = await Recruitment.countDocuments({ createdBy: user._id });

    res.json({
      recruitments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRecruitments: count,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// READ - Get a recruitment by ID
exports.getRecruitmentById = async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id).populate(
      'createdBy'
    );
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }
    res.json(recruitment);
  } catch (error) {
    handleError(error, res);
  }
};

// UPDATE - Update a recruitment by ID
exports.updateRecruitmentById = async (req, res) => {
  try {
    const recruitment = await Recruitment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation is run
      }
    );
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }
    res.json(recruitment);
  } catch (error) {
    handleError(error, res);
  }
};

// DELETE - Delete a recruitment by ID
exports.deleteRecruitmentById = async (req, res) => {
  try {
    // just find the recruitment and check if it exists
    const recruitment = await Recruitment.findById(req.params.id);
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }
    // check if the user is the owner of the recruitment
    if (recruitment.createdBy.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // delete the recruitment
    await Recruitment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recruitment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recruitment' });
  }
};
