import React, { useState, useEffect, useRef } from "react";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  exportUsers,
  updateUserById,
} from "../api/user";
import { showToast } from "../services/toastService";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token") || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user by ID
  const deleteUser = async (userId) => {
    try {
      await deleteUserById(token, userId);
      showToast("User deleted successfully", "success");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  // Edit user by ID and open dialog
  const editUser = async (userId) => {
    try {
      const data = await getUserById(token, userId);
      setUserData(data);
      setIsDialogOpen(true);
    } catch (err) {
      setError("Failed to fetch user data");
    }
  };

  // Export users
  const exportUsersData = async () => {
    console.log("click is working")
    try {
      const data = await exportUsers(token);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError("Failed to export users");
    }
  };

  const handleCancel = () => {
    // Close the dialog and reset the form data and errors
    setIsDialogOpen(false);
    setFormErrors({});
    setUserData(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let errors = {};
    if (!userData.first_name) errors.first_name = "First Name is required";
    if (!userData.last_name) errors.last_name = "Last Name is required";
    if (!userData.email) errors.email = "Email is required";
    if (!userData.dob) errors.dob = "Date of Birth is required";
    if (!userData.gender) errors.gender = "Gender is required";
    if (!userData.role) errors.role = "Role is required"; 
    if (!userData.city) errors.city = "City is required"; 
    if (!userData.state) errors.state = "State is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateUser = async () => {
    if (!validateForm()) return;

    try {
      await updateUserById(token, userData._id, userData);
      showToast("User updated successfully", "success");
      fetchUsers();
      setIsDialogOpen(false);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!allowedTypes.includes(file.type)) {
      showToast(
        "Invalid file format. Only .xlsx and .csv are allowed.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await createUser(token, formData);
      showToast("User created successfully", "success");
      fetchUsers();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      showToast("Failed, please try again", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>User Management</h2>
      <div className="buttons">
        <label htmlFor="file-upload" className="file-upload-label">
          Import Excel File
          <input
            type="file"
            id="file-upload"
            ref={fileInputRef}
            accept=".xlsx, .csv"
            onChange={handleFileUpload}
            className="hidden-input" // hide the default file input
          />
        </label>

        {/* <input type="file" ref={fileInputRef} accept=".xlsx, .csv" onChange={handleFileUpload} /> */}
        <button className="export-btn" onClick={exportUsersData}>
          Export
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => editUser(user._id)}>Edit</button>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit User Dialog */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3>Edit User</h3>
            <form>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={userData.first_name || ""}
                  onChange={handleFormChange}
                />
                {formErrors.first_name && (
                  <p className="error">{formErrors.first_name}</p>
                )}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={userData.last_name || ""}
                  onChange={handleFormChange}
                />
                {formErrors.last_name && (
                  <p className="error">{formErrors.last_name}</p>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ""}
                  onChange={handleFormChange}
                />
                {formErrors.email && (
                  <p className="error">{formErrors.email}</p>
                )}
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={
                    userData.dob
                      ? new Date(userData.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleFormChange}
                />
                {formErrors.dob && <p className="error">{formErrors.dob}</p>}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={userData.gender || ""}
                  onChange={handleFormChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {formErrors.gender && (
                  <p className="error">{formErrors.gender}</p>
                )}
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={userData.role || ""}
                  onChange={handleFormChange}
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role && <p className="error">{formErrors.role}</p>}
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={userData.city || ""}
                  onChange={handleFormChange}
                />
                 {formErrors.city && <p className="error">{formErrors.city}</p>}
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={userData.state || ""}
                  onChange={handleFormChange}
                />
                  {formErrors.state && <p className="error">{formErrors.state}</p>}
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  // onClick={() => setIsDialogOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  className="update-btn"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
