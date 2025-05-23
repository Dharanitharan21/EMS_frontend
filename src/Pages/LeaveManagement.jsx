import { Link } from "react-router-dom";
import "../Styles/LeaveManagement.css";
import { useEffect, useState } from "react";
import axios from "../Components/axiosInstance";
const LeaveManagement = () => {
  const [leaves, setleaves] = useState([])

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("https://employee-leave-management-x4wr.onrender.com/api/list-leave-applications");
        setleaves(res.data)
        console.log(res.data);

      } catch (err) {

        console.error("Failed to fetch departments:", err);
      }
    }
    fetchLeaves()
  }, [])

  return (
    <div className="LMP-container">
      <header className="LMP-leave-header">
        <h1>Leave Management</h1>
        <p>Manage employee leave applications</p>
      </header>

      <div className="LMP-card">
        <div className="LMP-card-content">
          <div className="LMP-tabs">
            <div className="LMP-tabs-list">
              <button className="LMP-tab-button active">All Leaves</button>
              <Link to="/admin/leave-applications/pending" className="LMP-tab-button">Pending</Link>
              <Link to="/admin/leave-applications/approved" className="LMP-tab-button">Approved</Link>
              <Link to="/admin/leave-applications/rejected" className="LMP-tab-button">Rejected</Link>
            </div>

            <div className="LMP-tab-content">
              <div className="LMP-table-container">
                <table className="LMP-leave-table">
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
                    {leaves.length > 0 ? (
                      leaves.map((leave, index) => (
                        <tr key={leave.id}>
                          <td>
                            <div className="LMP-emp-info">
                              <strong>{leave.first_name} {leave.last_name}</strong>
                              <div className="LMP-emp-code">{leave.employee_code}</div>
                            </div>
                          </td>
                          <td>{leave.type_name}</td>
                          <td>
                            <div className="LMP-duration">
                              <small>From</small>
                              <div>{new Date(leave.from_date).toLocaleDateString()}</div>
                              <small>To</small>
                              <div>{new Date(leave.to_date).toLocaleDateString()}</div>
                            </div>
                          </td>
                          <td>{new Date(leave.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`LMP-lm-status ${leave.status}`}>
                              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <Link to={`/admin/leave-applications/${leave.id}`} className="LMP-view-link">
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="LMP-no-records">No leave applications found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
