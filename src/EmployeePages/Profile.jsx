import React, { useState, useEffect } from "react";
import "../Styles/Profile.css";
import axios from "../Components/axiosInstance"; // Adjust the path if needed
import Swal from "sweetalert2";

const Profile = () => {
  const userId = localStorage.getItem("userId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    gender: "",
    department_id: "",
    birth_date: "",
    country: "",
    city: "",
    address: "",
    role: "",
    employee_status: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://employee-leave-management-x4wr.onrender.com/api/getbyuser/${userId}`);
        const data = res.data;
        data.birth_date = data.birth_date?.split("T")[0]; 
        setFormData(data);
       console.log(res.data)
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(`https://employee-leave-management-x4wr.onrender.com/api/update-user/${userId}`, formData);
       Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile updated successfully!',
        confirmButtonText: 'OK'
      });
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="PP-profile-container">
      <header className="PP-profile-header">
        <h1>My Profile</h1>
        <p>View and update your profile information</p>
      </header>

      <div className="PP-profile-grid">
        {/* Summary Card */}
        <div className="PP-card profile-summary">
          <h2>Employee Information</h2>
          <div className="PP-profile-name">
            <strong>
              {formData?.first_name} {formData?.last_name}
            </strong>
            <p className="PP-text-muted">{formData?.role}</p>
          </div>
          <div className="PP-profile-details">
            <p><span>Employee ID:</span> {formData?.employee_code}</p>
            <p><span>Department ID:</span> {formData?.department_id}</p>
            <p><span>Join Date:</span>{new Date(formData.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="PP-card PP-profile-form">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="PP-form-grid">
              <div className="PP-form-group">
                <label>First Name</label>
                <input name="first_name" value={formData.first_name} onChange={handleChange} />
              </div>
              <div className="PP-form-group">
                <label>Last Name</label>
                <input name="last_name" value={formData.last_name} onChange={handleChange} />
              </div>
              <div className="PP-form-group">
                <label>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="PP-form-group">
                <label>Mobile</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} />
              </div>

              <div className="PP-form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="PP-form-group">
                <label>Date of Birth</label>
                <input name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
              </div>
              <div className="PP-form-group">
                <label>Country</label>
                <input name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="PP-form-group">
                <label>City/Town</label>
                <input name="city" value={formData.city} onChange={handleChange} />
              </div>
            </div>
            <div className="PP-form-group full-width">
              <label>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="PP-form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
