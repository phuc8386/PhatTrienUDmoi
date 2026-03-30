const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;

    // Validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username, password and email are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (existingUser && !existingUser.isDeleted) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const user = new User({
      username,
      password,
      email,
      fullName: fullName || "",
      avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
      role: role || null
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (not deleted)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('role');
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, fullName, avatarUrl, role, loginCount } = req.body;

    let user = await User.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new username/email already exists
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && !existingUser.isDeleted) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && !existingUser.isDeleted) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    user.username = username || user.username;
    user.password = password || user.password;
    user.email = email || user.email;
    user.fullName = fullName !== undefined ? fullName : user.fullName;
    user.avatarUrl = avatarUrl !== undefined ? avatarUrl : user.avatarUrl;
    user.role = role !== undefined ? role : user.role;
    user.loginCount = loginCount !== undefined ? loginCount : user.loginCount;

    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Soft delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Enable user (set status to true)
exports.enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required" });
    }

    const user = await User.findOne({
      email,
      username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with provided email and username" });
    }

    user.status = true;
    await user.save();

    res.status(200).json({
      message: "User enabled successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Disable user (set status to false)
exports.disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required" });
    }

    const user = await User.findOne({
      email,
      username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with provided email and username" });
    }

    user.status = false;
    await user.save();

    res.status(200).json({
      message: "User disabled successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
