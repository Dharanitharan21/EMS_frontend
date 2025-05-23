import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Styles/Signup.css';

const MySwal = withReactContent(Swal);

const Signup = () => {
  const nav = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);
  const [userInput, setUserInput] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin", 
  });

  const [errors, setErrors] = useState({});



 useEffect(() => {
    MySwal.fire({
      title: 'Admin Access',
      text: 'Enter the admin signup key',
      input: 'password',
      inputPlaceholder: 'Enter admin password',
      inputAttributes: { autocapitalize: 'off' },
      showCancelButton: true,
      cancelButtonText:'Cancel',
      confirmButtonText: 'Enter',
      allowOutsideClick: false,
     preConfirm: (inputValue) => {
      if (inputValue !== 'admin1234') {
        Swal.showValidationMessage('Incorrect admin password');
      }
       else {
        setAccessGranted(true);
      }
    }
  })
}, []);




  const handleInputChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userInput.employee_code) newErrors.employee_code = "Employee code is required";
    if (!userInput.first_name) newErrors.first_name = "First name is required";
    if (!userInput.last_name) newErrors.last_name = "Last name is required";
    if (!userInput.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!userInput.password) {
      newErrors.password = "Password is required";
    } else if (userInput.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (userInput.confirmPassword !== userInput.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("https://employee-leave-management-x4wr.onrender.com/api/signup", userInput);
      Swal.fire("Success", "Admin registered successfully", "success");
      nav("/");
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire("Error", "Failed to register admin", "error");
    }
  };

  if (!accessGranted) return null; // Prevent form until password passed

  return (
    <div className="signup-page">
      <Container maxWidth="xs" className="signup-container">
        <Box className="signup-box">
          <Typography variant="h5" textAlign="center">Admin Signup</Typography>
          <form onSubmit={handleSubmit} className="signup-form">
            <TextField
              label="Employee Code"
              name="employee_code"
              fullWidth
              margin="normal"
              value={userInput.employee_code}
              onChange={handleInputChange}
              error={!!errors.employee_code}
              helperText={errors.employee_code}
            />
            <TextField
              label="First Name"
              name="first_name"
              fullWidth
              margin="normal"
              value={userInput.first_name}
              onChange={handleInputChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
            <TextField
              label="Last Name"
              name="last_name"
              fullWidth
              margin="normal"
              value={userInput.last_name}
              onChange={handleInputChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={userInput.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={userInput.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="normal"
              value={userInput.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button type="submit" variant="contained" className="signup-button">Sign Up</Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
