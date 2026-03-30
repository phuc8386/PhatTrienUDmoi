const Role = require('../models/Role');

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole && !existingRole.isDeleted) {
      return res.status(400).json({ message: "Role name already exists" });
    }

    const role = new Role({
      name,
      description: description || ""
    });

    await role.save();
    res.status(201).json({
      message: "Role created successfully",
      data: role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all roles (not deleted)
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.status(200).json({
      message: "Roles retrieved successfully",
      data: roles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      message: "Role retrieved successfully",
      data: role
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid role ID" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    let role = await Role.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Check if new name already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole && !existingRole.isDeleted) {
        return res.status(400).json({ message: "Role name already exists" });
      }
    }

    role.name = name || role.name;
    role.description = description !== undefined ? description : role.description;

    await role.save();
    res.status(200).json({
      message: "Role updated successfully",
      data: role
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid role ID" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Soft delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).json({ message: "Role not found" });
    }

    role.isDeleted = true;
    await role.save();

    res.status(200).json({
      message: "Role deleted successfully"
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid role ID" });
    }
    res.status(500).json({ message: error.message });
  }
};
