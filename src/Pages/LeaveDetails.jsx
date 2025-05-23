import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import '../Styles/LeaveDetails.css';
import { toast } from "sonner";
import { Check, ChevronLeft, X } from "lucide-react";
import axios from "../Components/axiosInstance";


const LeaveDetails = () => {
  const { id } = useParams();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [leaves, setleaves] = useState([])
  const [employee, setEmployees] = useState([])
 const role = localStorage.getItem("role");

  const isAdmin = role === "admin";
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('https://employee-leave-management-x4wr.onrender.com/api/getusers');
        setEmployees(res.data);
      } catch (err) {
        toast.error("Failed to fetch employees");
      }
    };
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`https://employee-leave-management-x4wr.onrender.com/api/getbyId-leave-applications/${id}`);
        setleaves(res.data)
        console.log(res.data);

      } catch (err) {

        console.error("Failed to fetch departments:", err);
      }
    }
    fetchEmployees()
    fetchLeaves()
  }, [])

  const handleApproveLeave = async () => {
    try {
      await axios.put(`https://employee-leave-management-x4wr.onrender.com/api/upadte-leave-applications/status/${id}`, {
        status: "approved",
        admin_remarks: "Approved by admin",
        approved_by: 1, // dynamically replace with admin ID if available
      });

      toast.success("Leave application approved successfully");
      setleaves((prev) => ({ ...prev, status: "approved" }));
      setIsApproveDialogOpen(false);
    } catch (err) {
      toast.error("Failed to approve leave application");
      console.error(err);
    }
  };

  const handleRejectLeave = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await axios.put(`https://employee-leave-management-x4wr.onrender.com/api/upadte-leave-applications/status/${id}`, {
        status: "rejected",
        admin_remarks: rejectReason,
        rejected_by: 1, // dynamically replace if needed
      });

      toast.success("Leave application rejected successfully");
      setleaves((prev) => ({ ...prev, status: "rejected", rejectionReason: rejectReason }));
      setIsRejectDialogOpen(false);
      setRejectReason('');
    } catch (err) {
      toast.error("Failed to reject leave application");
      console.error(err);
    }
  };

  const calculateDuration = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Calculate difference in milliseconds
    const diffTime = toDate - fromDate;

    // Convert to days (+1 to include both start and end dates)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };
  const approver = employee.find(emp => emp.id === leaves.approved_by);
  const rejector = employee.find(emp => emp.id === leaves.rejected_by);

  return (
    <div className='LDP-leavedetails-container'>
      <header className="LDP-header">
        <Link to={isAdmin ? "/admin/leave-applications" : "/employee/leave-history"} className="LDP-back-link">
          <ChevronLeft size={16} /> Back to Leave Applications
        </Link>
        <h1>Leave Application Details</h1>
        <div className="LDP-status">
          <span>Status:</span>
          <span className={`LDP-badge ${leaves.status}`}>{leaves.status}</span>
        </div>
      </header>

      <div className="LDP-details-grid">
        <div className="LDP-card main-card">
          <div className="LDP-card-header">
            <h2>Leave Application</h2>
            <p>Submitted on <br /> {new Date(leaves.created_at).toLocaleDateString()}</p>
          </div>
          <div className="LDP-card-content">
            <div className="LDP-row">
              <div>
                <label>Leave Type</label>
                <p>{leaves.type_name}</p>
              </div>
              <div>
                <label>Duration</label>
                <p>{calculateDuration(leaves.from_date, leaves.to_date)} days</p>
              </div>
              <div>
                <label>From</label>
                <p>{new Date(leaves.from_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label>To</label>
                <p>{new Date(leaves.to_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <label>Reason</label>
              <p>{leaves.description}</p>
            </div>

            {leaves.status === 'approved' && (
              <div className="LDP-info-section">
                <label className='LDP-info-head'>Approval Information</label>
                <div className="LDP-row LDP-info-row">
                  <div>
                    <label>Approved By</label>
                    <p>{approver ? `${approver.first_name} ${approver.last_name}` : 'N/A'}</p>
                  </div>
                  <div>
                    <label>Approved On</label>
                    <p> {new Date(leaves.approved_on).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {leaves.status === 'rejected' && (
              <div className="LDP-info-section">
                <label>Rejection Information</label>
                <div className="LDP-row">
                  <div>
                    <label>Rejected By</label>
                    <p><p>{rejector ? `${rejector.first_name} ${rejector.last_name}` : 'N/A'}</p>
                    </p>
                  </div>
                  <div>
                    <label>Rejected On</label>
                    <p>{new Date(leaves.approved_on).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label>Reason</label>
                  <p>{leaves.admin_remarks}</p>
                </div>
              </div>
            )}
          </div>

          {leaves.status === 'pending' && isAdmin && (
            <div className="LDP-card-footer">
              <button className="LDP-btn reject" onClick={() => setIsRejectDialogOpen(true)}>
                <X size={16} /> Reject
              </button>
              <button className="LDP-btn approve" onClick={() => setIsApproveDialogOpen(true)}>
                <Check size={16} /> Approve
              </button>
            </div>
          )}
        </div>

        <div className="LDP-card">
          <div className="LDP-card-header">
            <h2>Employee Info</h2>
          </div>
          <div className="LDP-card-content">
            <div><label>Name</label><p>{leaves.first_name} {leaves.last_name}</p></div>
            <div><label>Department</label><p>{leaves.department_name}</p></div>
          </div>
        </div>
      </div>

      {isApproveDialogOpen && (
        <div className="LDP-modal">
          <div className="LDP-modal-content">
            <h3>Approve Leave</h3>
            <p>Are you sure you want to approve this leave?</p>
            <div className="LDP-modal-actions">
              <button onClick={() => setIsApproveDialogOpen(false)}>Cancel</button>
              <button className="LDP-btn approve" onClick={handleApproveLeave}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {isRejectDialogOpen && (
        <div className="LDP-modal">
          <div className="LDP-modal-content">
            <h3>Reject Leave</h3>
            <label>Reason</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
            />
            <div className="LDP-modal-actions">
              <button onClick={() => setIsRejectDialogOpen(false)}>Cancel</button>
              <button className="LDP-btn reject" onClick={handleRejectLeave}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveDetails;
