import Joi from 'joi';
import multer from 'multer';
import xlsx from 'xlsx';
import mongoose from "mongoose";
import User from '../models/users.model.js';

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file'); // 'file' is the form field name

// Joi validation schema for user data
const userSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').required(),
  dob: Joi.date().iso().required(),
  gender: Joi.string().valid('male', 'female').required(),
  email: Joi.string().email().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
});

// Function to parse date string and convert to JS Date
function parseDate(dateString) {
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate)) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return parsedDate;
}

export const uploadUser = async (req, res) => {
  try {
    // Multer handles file upload before this function is executed
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err.message });
      }

      // Check if a file is provided
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Parse the uploaded XLSX file
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Assume the data is in the first sheet
      const data = xlsx.utils.sheet_to_json(sheet);

      // Check if the header matches the expected order
      const requiredHeaders = ['first_name', 'last_name', 'role', 'dob', 'gender', 'email', 'city', 'state'];
      const headers = Object.keys(data[0]);

      if (!headers.every((header, index) => header === requiredHeaders[index])) {
        return res.status(400).json({
          message: 'Invalid file format. Headers should be in the same order as expected.',
        });
      }

      // Process each row and validate the data
      for (let row of data) {
        // Check if any required field is missing
        const missingFields = requiredHeaders.filter(field => !row[field]);
        if (missingFields.length > 0) {
          return res.status(400).json({
            message: `Missing required fields in row: ${JSON.stringify(row)}`,
            missingFields,
          });
        }

        // Parse the dob field if it's a valid date string
        if (row.dob) {
          try {
            row.dob = parseDate(row.dob); // Convert the string date to JavaScript Date object
          } catch (err) {
            return res.status(400).json({
              message: `Invalid date format in row: ${JSON.stringify(row)}`,
              error: err.message,
            });
          }
        }

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email: row.email });
        if (existingUser) {
          console.log(`Email ${row.email} already exists, skipping row.`);
          continue; // Skip this row and move to the next one
        }

        // Validate each row using Joi
        const { error } = userSchema.validate(row);
        if (error) {
          return res.status(400).json({
            message: `Invalid data in row: ${JSON.stringify(row)}`,
            error: error.details,
          });
        }

        // Save valid data to the database
        const user = new User(row);
        await user.save();
      }

      // Success response
      res.status(200).json({ message: 'File processed and users uploaded successfully' });
    });
  } catch (error) {
    console.error('Error in uploadUser:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllUser = async (req, res) => {
    try {
      // Fetch users where the role is 'user'
      const users = await User.find({ role: 'user' });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error in getAllUser:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const getById = async (req, res) => {

    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid ID format" });
        }
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in getById:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const updateUserById = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Error in updateUserById:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid ID format" });
        }
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in deleteUserById:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const exportUser = async (req, res) => {
    console.log(
        "export function is working"
    )
    try {
      // Fetch users where the role is 'user'
      const users = await User.find({ role: 'user' });
  
      // If no users found
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      // Convert users to JSON-compatible array
      const usersData = users.map(user => ({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        city: user.city,
        state: user.state,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));
  
      // Create a new worksheet
      const ws = xlsx.utils.json_to_sheet(usersData);
  
      // Create a new workbook
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Users');
  
      // Set the filename for the Excel file
      const fileName = 'users.xlsx';
  
      // Send the Excel file as a response
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      // Write the Excel file to the response
      return res.send(xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' }));
    } catch (error) {
      console.error("Error in exportUser:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  