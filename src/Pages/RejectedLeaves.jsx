import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "../Styles/RejectedLeaves.css";
import { useEffect, useState } from "react";
import axios from "../Components/axiosInstance";
const RejectedLeaves = () => {
  const [rejectedleaves,setrejectedleaves]=useState([])
     
     useEffect(()=> {
       const fetchrejectedLeaves = async () => {
        try {
          const res = await axios.get("https://employee-leave-management-x4wr.onrender.com/api/getbyStatus-leave-applications/status/rejected");
          setrejectedleaves(res.data)
          console.log(res.data);
          
      }catch(err){
    
        console.error("Failed to fetch departments:", err);
      }
    }
      fetchrejectedLeaves()
     },[])
  
  return (
    <div className="rejected-leaves-container">
      <header className="rejected-header">
        <Link 
          to="/admin/leave-applications" 
          className="back-link"
        >
          <ChevronLeft className="back-icon" />
          Back to All Leaves
        </Link>
        <h1>Rejected Leaves</h1>
        <p>List of all rejected leave applications</p>
      </header>

      <div className="card">
        <div className="card-header">
          <h2>Rejected Leave Applications</h2>
          <p>View details of all rejected leave requests</p>
        </div>
        <div className="card-content">
          <div className="table-wrapper">
            <table className="leave-table">
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
                {rejectedleaves.map((leave) => (
                   <tr key={leave.id}>
                <td>
                  <div className="emp-info">
                    <strong>{leave.first_name} {leave.last_name}</strong>
                    <div className="emp-code">{leave.employee_code}</div>
                  </div>
                </td>
                <td>{leave.type_name}</td>
                <td>
                  <div className="duration">
                    <small>From</small>
                    <div>{new Date(leave.from_date).toLocaleDateString()}</div>
                    <small>To</small>
                    <div>{new Date(leave.to_date).toLocaleDateString()}</div>
                  </div>
                </td>
                <td>{ new Date(leave.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`lm-status ${leave.status}`}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/leave-applications/${leave.id}`} className="view-link">
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

export default RejectedLeaves;
