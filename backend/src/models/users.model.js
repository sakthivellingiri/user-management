import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  role: {
    type: String,
    required: false,
    enum: ["user", "admin"],
  },
  dob: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: false,
    enum: ["male", "female", "other"],
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: false,
    minlength: 6,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
