import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ApprovedLeaves.css";
import { useEffect, useState } from "react";
import axios from "../Components/axiosInstance";


const ApprovedLeaves = () => {
  const [approvedleaves,setapprovedleaves]=useState([])
   
   useEffect(()=> {
     const fetchapprovedLeaves = async () => {
      try {
        const res = await axios.get("https://employee-leave-management-x4wr.onrender.com/api/getbyStatus-leave-applications/status/pending");
        setapprovedleaves(res.data)
        console.log(res.data);
        
    }catch(err){
  
      console.error("Failed to fetch departments:", err);
    }
  }
    fetchapprovedLeaves()
   },[])

  return (
    <div className="approved-leaves-page-container">
      <header className="approved-leaves-page-header">
        <Link to="/admin/leave-applications" className="approved-leaves-page-back-link">
          ← Back to All Leaves
        </Link>
        <h1 className="approved-leaves-page-title">Approved Leaves</h1>
        <p className="approved-leaves-page-subtitle">List of all approved leave applications</p>
      </header>

      <div className="approved-leaves-page-card">
        <div className="approved-leaves-page-card-header">
          <h2 className="approved-leaves-page-card-title">Approved Leave Applications</h2>
          <p className="approved-leaves-page-card-description">
            View details of all approved leave requests
          </p>
        </div>
        <div className="approved-leaves-page-card-content">
          <div className="approved-leaves-page-table-wrapper">
            <table className="approved-leaves-page-leave-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                 

                </tr>
              </thead>
              <tbody>
                {approvedleaves.map((leave) => (
                   <tr key={leave.id}>
                <td>
                  <div className="approved-leaves-page-emp-info">
                    <strong>{leave.first_name} {leave.last_name}</strong>
                  </div>
                </td>
                <td>{leave.type_name}</td>
                <td>
                  <div className="approved-leaves-page-duration">
                    <small>From</small>
                    <div>{new Date(leave.from_date).toLocaleDateString()}</div>
                    <small>To</small>
                    <div>{new Date(leave.to_date).toLocaleDateString()}</div>
                  </div>
                </td>
                <td>{ new Date(leave.approved_on).toLocaleDateString()}</td>
                <td>
                  <span className={`lm-status ${leave.status}`}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/leave-applications/${leave.id}`} className="approved-leaves-page-view-link">
                    View Details
                  </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedLeaves;
