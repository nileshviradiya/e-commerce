const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password, // Hashing is done by pre-save hook in UserModel
    });

    // Select all fields except passwordHash for the response
    const userResponse = await User.findById(user._id).select('-passwordHash');

    res.status(201).json({
      success: true,
      data: userResponse,
      // token: generateToken(user._id, user.role) // Optionally return token on registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // User and password match, generate token
    const token = generateToken(user._id, user.role);

    // Select all fields except passwordHash for the response
    const userResponse = await User.findById(user._id).select('-passwordHash');

    res.status(200).json({
      success: true,
      token,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
