import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,

} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/login.css';
import Swal from 'sweetalert2'
function Login() {
  const [userInput, setUserInput] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validateForm = () => {
    let newErrors = {};
    if (!userInput.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!userInput.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("https://employee-leave-management-x4wr.onrender.com/api/login", userInput);
      console.log("Login successful:", res.data);

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("name", `${user.first_name} ${user.last_name}`);
      localStorage.setItem("role", user.role);

      nav(user.role === "admin" ? "/admin" : "/employee");

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
   Swal.fire({
  icon: 'error',
  title: 'Login Failed',
  text:error.response?.data ||error.message,
  confirmButtonColor: '#d33',
});
      ;
    }
  };

  return (
    <div className="login-page">
      <Container maxWidth="xs" className="login-container">
        <Box>
          <div className="login-heading">
            <h2 className="title">Leave Management System</h2>
            <p className="subtitle">Sign in to access your dashboard</p>
          </div>
          <form onSubmit={handleSubmit}>
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
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={userInput.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Link className="signup-link" to="/signup">Don't have an account? Admin Sign up</Link>

            <Button type="submit" variant="contained" className="login-button">
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
