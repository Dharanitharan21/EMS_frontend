import { Users, Calendar, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import '../Styles/AdminDashboard.css';
import { useEffect, useState } from 'react';
import axios from '../Components/axiosInstance';
import { toast } from 'sonner';

function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, departmentsRes, typesRes, leavesRes] = await Promise.all([
          axios.get('/api/getusers', { headers }),
          axios.get('/api/listdepartments', { headers }),
          axios.get('/api/list-leave-types', { headers }),
          axios.get('/api/list-leave-applications', { headers }),
        ]);

        const approved = leavesRes.data.filter(l => l.status === 'approved').length;
        const rejected = leavesRes.data.filter(l => l.status === 'rejected').length;
        const pending = leavesRes.data.filter(l => l.status === 'pending').length;

        setStats([
          { title: 'Total Employees', value: usersRes.data.length, icon: <Users />, color: 'blue' },
          { title: 'Departments', value: departmentsRes.data.length, icon: <Building2 />, color: 'purple' },
          { title: 'Leave Types', value: typesRes.data.length, icon: <Calendar />, color: 'pink' },
          { title: 'Pending Requests', value: pending, icon: <Clock />, color: 'yellow' },
          { title: 'Approved Leaves', value: approved, icon: <CheckCircle />, color: 'green' },
          { title: 'Rejected Leaves', value: rejected, icon: <XCircle />, color: 'red' },
        ]);

        setRecentLeaves(leavesRes.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const handleApproveLeave = async () => {
    try {
      await axios.put(`/api/upadte-leave-applications/status/${selectedLeaveId}`, {
        status: "approved",
        admin_remarks: "Approved by admin",
        approved_by: 1,
      }, { headers });

      toast.success("Leave application approved successfully");
      setRecentLeaves(prev =>
        prev.map(l => l.id === selectedLeaveId ? { ...l, status: "approved" } : l)
      );
      setIsApproveDialogOpen(false);
      setSelectedLeaveId(null);
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
      await axios.put(`/api/upadte-leave-applications/status/${selectedLeaveId}`, {
        status: "rejected",
        admin_remarks: rejectReason,
        rejected_by: 1,
      }, { headers });

      toast.success("Leave application rejected successfully");
      setRecentLeaves(prev =>
        prev.map(l => l.id === selectedLeaveId ? { ...l, status: "rejected", rejectionReason: rejectReason } : l)
      );
      setIsRejectDialogOpen(false);
      setRejectReason('');
      setSelectedLeaveId(null);
    } catch (err) {
      toast.error("Failed to reject leave application");
      console.error(err);
    }
  };

  return (
    <div className="admindashboard-container">
      <header className="admindashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of the leave management system</p>
      </header>

      <div className="admindashboard-stats-grid">
        {stats.map((stat, index) => (
          <div className="admindashboard-stat-card" key={index}>
            <div className="admindashboard-stat-card-header">
              <span>{stat.title}</span>
              <div className={`admindashboard-stat-icon ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="admindashboard-stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="admindashboard-leave-section">
        <div className="admindashboard-leave-card">
          <div className="admindashboard-leave-header">
            <h2>Recent Leave Applications</h2>
            <p>Review the latest leave requests from employees</p>
          </div>
          <div className="admindashboard-table-wrapper">
            <table className="admindashboard-leave-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{`${leave.first_name} ${leave.last_name}`}</td>
                    <td>{leave.department_name}</td>
                    <td>{leave.type_name}</td>
                    <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                    <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`admindashboard-status ${leave.status}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'pending' && (
                        <div className="admindashboard-action-buttons">
                          <button
                            onClick={() => {
                              setSelectedLeaveId(leave.id);
                              setIsApproveDialogOpen(true);
                            }}
                            className="admindashboard-approve-btn"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLeaveId(leave.id);
                              setIsRejectDialogOpen(true);
                            }}
                            className="admindashboard-reject-btn"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
}

export default AdminDashboard;
