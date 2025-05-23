import React, { useState, useEffect } from "react";
import "../Styles/LeaveHistory.css";
import axios from "../Components/axiosInstance"; // Adjust path if needed
import { Link } from "react-router-dom";

const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return <span className="LHP-badge badge-approved">Approved</span>;
    case "rejected":
      return <span className="LHP-badge badge-rejected">Rejected</span>;
    case "pending":
      return <span className="LHP-badge badge-pending">Pending</span>;
    default:
      return <span className="LHP-badge badge-default">Unknown</span>;
  }
};

const LeaveDetails = ({ leave, onClose }) => {
  return (
    <div className="LHP-modal">
      <div className="LHP-modal-content">
        <h3>{leave.leave_type}</h3>
        <p><strong>Status:</strong> {getStatusBadge(leave.status)}</p>
        <p><strong>From:</strong> {new Date(leave.from_date).toLocaleDateString()}</p>
        <p><strong>To:</strong> {new Date(leave.to_date).toLocaleDateString()}</p>
        <p><strong>Applied On:</strong> { new Date(leave.created_at).toLocaleDateString()}</p>
        <p><strong>Reason:</strong> {leave.description}</p>
        {leave.comment && (
          <p><strong>Admin Comment:</strong> {leave.comment}</p>
        )}
        <button className="LHP-close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId =localStorage.getItem('userId')

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const res = await axios.get(`https://employee-leave-management-x4wr.onrender.com/api/getbyuser-leave-applications/user/${userId}`);
        setLeaveHistory(res.data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, [userId]);

  return (
    <div className="LHP-leave-history-container">
      <header>
        <h1>Leave History</h1>
        <p>Your leave application history</p>
      </header>

      <div className="LHP-card">
        <h2>Your Leave Applications</h2>
        <p>View all your leave applications and their current status</p>

        {loading ? (
          <p>Loading leave history...</p>
        ) : leaveHistory.length === 0 ? (
          <p>No leave applications found.</p>
        ) : (
          <div className="LHP-table-container">
            <table>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.type_name}</td>
                    <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                    <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                    <td> { new Date(leave.created_at).toLocaleDateString()}</td>
                    <td>{getStatusBadge(leave.status)}</td>
                    <td>
                     <Link to={`/employee/leave-applications/${leave.id}`} className="LHP-view-link">
                    View Details
                  </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLeave && (
        <LeaveDetails leave={selectedLeave} onClose={() => setSelectedLeave(null)} />
      )}
    </div>
  );
};

export default LeaveHistory;
