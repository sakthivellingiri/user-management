import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create a new user (file upload)
export const createUser = async (token, userData) => {
    console.log("data is passing inside the service")
    try {
        const response = await axios.post(`${API_URL}/upload-users`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Ensure correct content type
            },
        });
        return response.data;
    } catch (error) {
        console.error("API error:", error.response?.data || error.message);
        throw new Error('Failed to create user');
    }
};


// Get all users
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

// Get a user by ID
export const getUserById = async (token, userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user by ID');
  }
};



// Update a user by ID
export const updateUserById = async (token, userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

// Delete a user by ID
export const deleteUserById = async (token, userId) => {
  try {
    await axios.delete(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};

// Export users
export const exportUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/export-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to export users');
  }
};

