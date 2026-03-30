// client-example.js
// Example of how to interact with the API using fetch or axios

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// ==================== ROLE OPERATIONS ====================

// Create Role
async function createRole(roleData) {
  try {
    const response = await axios.post(`${API_BASE}/roles`, roleData);
    console.log('Role created:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating role:', error.response.data);
  }
}

// Get All Roles
async function getAllRoles() {
  try {
    const response = await axios.get(`${API_BASE}/roles`);
    console.log('All roles:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response.data);
  }
}

// Get Role by ID
async function getRoleById(roleId) {
  try {
    const response = await axios.get(`${API_BASE}/roles/${roleId}`);
    console.log('Role:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching role:', error.response.data);
  }
}

// Update Role
async function updateRole(roleId, updateData) {
  try {
    const response = await axios.put(`${API_BASE}/roles/${roleId}`, updateData);
    console.log('Role updated:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating role:', error.response.data);
  }
}

// Delete Role (Soft Delete)
async function deleteRole(roleId) {
  try {
    const response = await axios.delete(`${API_BASE}/roles/${roleId}`);
    console.log('Role deleted:', response.data);
  } catch (error) {
    console.error('Error deleting role:', error.response.data);
  }
}

// ==================== USER OPERATIONS ====================

// Create User
async function createUser(userData) {
  try {
    const response = await axios.post(`${API_BASE}/users`, userData);
    console.log('User created:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating user:', error.response.data);
  }
}

// Get All Users
async function getAllUsers() {
  try {
    const response = await axios.get(`${API_BASE}/users`);
    console.log('All users:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error.response.data);
  }
}

// Get User by ID
async function getUserById(userId) {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}`);
    console.log('User:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error.response.data);
  }
}

// Update User
async function updateUser(userId, updateData) {
  try {
    const response = await axios.put(`${API_BASE}/users/${userId}`, updateData);
    console.log('User updated:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user:', error.response.data);
  }
}

// Delete User (Soft Delete)
async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${API_BASE}/users/${userId}`);
    console.log('User deleted:', response.data);
  } catch (error) {
    console.error('Error deleting user:', error.response.data);
  }
}

// Enable User (Set status = true)
async function enableUser(email, username) {
  try {
    const response = await axios.post(`${API_BASE}/users/enable`, {
      email,
      username
    });
    console.log('User enabled:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error enabling user:', error.response.data);
  }
}

// Disable User (Set status = false)
async function disableUser(email, username) {
  try {
    const response = await axios.post(`${API_BASE}/users/disable`, {
      email,
      username
    });
    console.log('User disabled:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error disabling user:', error.response.data);
  }
}

// ==================== EXAMPLE USAGE ====================

(async () => {
  // Create roles
  const adminRole = await createRole({
    name: 'Admin',
    description: 'Administrator role'
  });

  const userRole = await createRole({
    name: 'User',
    description: 'Regular user role'
  });

  // Create users
  const user1 = await createUser({
    username: 'john_doe',
    password: 'securePassword123',
    email: 'john@example.com',
    fullName: 'John Doe',
    role: adminRole._id
  });

  const user2 = await createUser({
    username: 'jane_smith',
    password: 'anotherPassword456',
    email: 'jane@example.com',
    fullName: 'Jane Smith',
    role: userRole._id
  });

  // Get all users
  const allUsers = await getAllUsers();

  // Enable user
  await enableUser('john@example.com', 'john_doe');

  // Disable user
  await disableUser('jane@example.com', 'jane_smith');

  // Update user
  await updateUser(user1._id, {
    fullName: 'John Doe Updated',
    loginCount: 5
  });

  // Get user by ID
  await getUserById(user1._id);

  // Delete user (soft delete)
  await deleteUser(user2._id);
})();

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  enableUser,
  disableUser
};
