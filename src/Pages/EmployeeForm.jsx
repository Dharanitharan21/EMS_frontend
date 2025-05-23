import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../Components/axiosInstance";
import "../Styles/EmployeeForm.css";
import { toast } from "sonner";

const API_BASE = "https://employee-leave-management-x4wr.onrender.com/api";

const EmployeeForm = ({ initialData = {}, onSubmit }) => {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/listdepartments`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const validationSchema = Yup.object({
    employee_code: Yup.string().required("Employee code is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email().required("Email is required"),
    mobile: Yup.string().required("Mobile number is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
    gender: Yup.string().required("Gender is required"),
    department_id: Yup.string().required("Department is required"),
    birth_date: Yup.string().required("Birth date is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    address: Yup.string().required("Address is required"),
  });

  const formik = useFormik({
    initialValues: {
      employee_code: initialData.employee_code || "",
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      email: initialData.email || "",
      mobile: initialData.mobile || "",
      password: "",
      confirmPassword: "",
      gender: initialData.gender || "",
      department_id: initialData.department_id || "",
      birth_date: initialData.birth_date || "",
      country: initialData.country || "",
      city: initialData.city || "",
      address: initialData.address || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const dataToSend = { ...values };
        delete dataToSend.confirmPassword;

        const response = await axios.post(`${API_BASE}/signup`, dataToSend);
        onSubmit(response.data);
        toast.success("Employee created successfully!");
        resetForm();
      } catch (error) {
        console.error(error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Failed to process request. Try again.");
      }

    },
    enableReinitialize: true,
  });

  return (
    <Box className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <Grid container
          spacing={2}
          columns={12}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(12, 1fr)',
              sm: 'repeat(12, 1fr)',
            },
          }}>
          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              label="Employee Code"
              name="employee_code"
              value={formik.values.employee_code}
              onChange={formik.handleChange}
              error={formik.touched.employee_code && Boolean(formik.errors.employee_code)}
              helperText={formik.touched.employee_code && formik.errors.employee_code}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              type="date"
              label="Birth Date"
              name="birth_date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.birth_date}
              onChange={formik.handleChange}
              error={formik.touched.birth_date && Boolean(formik.errors.birth_date)}
              helperText={formik.touched.birth_date && formik.errors.birth_date}
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              error={formik.touched.first_name && Boolean(formik.errors.first_name)}
              helperText={formik.touched.first_name && formik.errors.first_name}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              error={formik.touched.last_name && Boolean(formik.errors.last_name)}
              helperText={formik.touched.last_name && formik.errors.last_name}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              select
              fullWidth
              label="Department"
              name="department_id"
              value={formik.values.department_id}
              onChange={formik.handleChange}
              error={formik.touched.department_id && Boolean(formik.errors.department_id)}
              helperText={formik.touched.department_id && formik.errors.department_id}
            >
              <MenuItem value="">Select</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.department_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>


          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}   >
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            Add Employee
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EmployeeForm;
