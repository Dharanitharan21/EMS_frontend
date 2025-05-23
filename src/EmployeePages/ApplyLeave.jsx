import React, { useState, useEffect } from 'react';
import '../Styles/ApplyLeave.css';
import axios from '../Components/axiosInstance';
import { Select, MenuItem, FormControl, InputLabel, Box, TextField, Typography, TextareaAutosize, Button } from "@mui/material";
import Swal from "sweetalert2";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = localStorage.getItem('userId')


  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await axios.get('https://employee-leave-management-x4wr.onrender.com/api/list-leave-types');
        setLeaveTypes(res.data);
      } catch (err) {
        console.error("Failed to load leave types", err);
      }
    };
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('https://employee-leave-management-x4wr.onrender.com/api/leave-applications', {
        user_id: user,
        leave_type_id: parseInt(leaveType),
        from_date: startDate,
        to_date: endDate,
        description: reason,
        contact_number: contactNumber
      });

      Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Leave application submitted successfully!',
  confirmButtonText: 'OK'
});

      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setContactNumber("");
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Failed to submit leave application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  return (
    <div className="ALP-apply-leave-container">
      <h1 className="ALP-title">Apply for Leave</h1>
      <p className="ALP-subtitle">Submit a new leave request</p>

       <form className="ALP-leave-form" onSubmit={handleSubmit}>
      {/* Leave Type Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="leave-type-label">Leave Type</InputLabel>
        <Select
          labelId="leave-type-label"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          label="Leave Type"
        >
          <MenuItem value="">
            <em>Select leave type</em>
          </MenuItem>
          {leaveTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.type_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dates */}
      <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
        <TextField
          label="From Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="To Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: startDate }}
          fullWidth
          margin="normal"
          required
        />
      </Box>

      {/* Days Info */}
      {startDate && endDate && (
        <Typography variant="body1" mt={2}>
          Total Days: {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
        </Typography>
      )}

      {/* Reason for Leave */}
      <Box mt={2}>
        <Typography gutterBottom>
          Reason for Leave <span style={{ color: 'red' }}>*</span>
        </Typography>
        <TextareaAutosize
          minRows={4}
          placeholder="Please provide a reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: '90%',
            maxWidth: '100%',
            padding: '12px',
            borderRadius: '4px',
            borderColor: '#ccc',
            fontFamily: 'inherit',
            fontSize: '1rem',
             resize: 'vertical',
          }}
          required
        />
      </Box>

      {/* Actions */}
      <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </Box>
    </form>
    </div>
  );
};

export default ApplyLeave;
