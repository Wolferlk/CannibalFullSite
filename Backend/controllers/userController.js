const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { checkAuth } = require('../middleware/authMiddleware'); // Custom middleware for checking token

// Add User Controller
exports.addUser = async (req, res) => {
  try {
    const { name, email, role, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const newUser = new User({
      name,
      email,
      role,
      username,
      password
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View Users - Only Admins can view all users
exports.viewUsers = async (req, res) => {
  try {
    // Only admins can view all users
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Return the list of users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View User Profile - Returns a specific user's profile, authenticated by token
exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get the user from the token ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Return user profile
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit User Controller
exports.editUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, role, username, password } = req.body;

  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is being updated and hash it if needed
    if (password && password !== userToUpdate.password) {
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }

    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.role = role || userToUpdate.role;
    userToUpdate.username = username || userToUpdate.username;

    const updatedUser = await userToUpdate.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete User Controller
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Only admins can delete users
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToDelete.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin' });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login Controller
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT token
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile Update Route (Optional)
exports.updateProfile = async (req, res) => {
  const { name, email, username } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
