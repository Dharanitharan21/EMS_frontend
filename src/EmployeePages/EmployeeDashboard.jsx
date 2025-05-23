import '../Styles/EmployeeDashboard.css';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../Components/axiosInstance';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [leaveapplication,setleaveapplication]=useState([])
  const role =localStorage.getItem('role')
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get user profile
        const userRes = await axios.get(`https://employee-leave-management-x4wr.onrender.com/api/getbyuser/${userId}`);
        setUser(userRes.data);
        // 2. Get leave stats
        const statsRes = await axios.get(`https://employee-leave-management-x4wr.onrender.com/api/getbyuser-leave-applications/user/${userId}`);
        setleaveapplication(statsRes.data)
        const rejected = statsRes.data.filter(l => l.status === 'rejected').length || "0";
        const approved = statsRes.data.filter(l => l.status === 'approved').length || "0";
        const pending = statsRes.data.filter(l => l.status === 'pending').length || "0";
        setStats([
          { title: "Total Leave Requests", value: statsRes.data.length, icon: <Calendar className="h-6 w-6" />, color: "bg-blue-500" },
          { title: "Rejected Leave Requests", value: rejected, icon: <CalendarIcon className="h-6 w-6" />, color: "bg-purple-500" },
          { title: "Approved Leave Requests", value: approved, icon: <CalendarIcon className="h-6 w-6" />, color: "bg-green-500" },
          { title: "Pending Leave Requests", value: pending, icon: <Clock className="h-6 w-6" />, color: "bg-yellow-500" },
        ])
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };  
      fetchData();
  }, [userId]);
  const calculateDuration = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Calculate difference in milliseconds
    const diffTime = toDate - fromDate;

    // Convert to days (+1 to include both start and end dates)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };
  return (
    <div className="EDP-employee-dashboard">
      <header className="EDP-dashboard-header">
        <h1 className="EDP-dashboard-title">Welcome back, {user?.first_name || '...'}</h1>
        <p className="EDP-dashboard-subtitle">{role}</p>   
      </header>

      <div className="EDP-dashboard-stats">
        {stats.map((stat, index) => (
          <div key={index} className="EDP-card EDP-stat-card">
            <div className="EDP-card-header EDP-stat-header">
              <h2 className="EDP-card-title EDP-stat-title">{stat.title}</h2>
              <div className={`EDP-stat-icon ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="EDP-card-content">
              <div className="EDP-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="EDP-dashboard-content">
        <div className="EDP-card EDP-leave-history-card">
          <div className="EDP-card-header">
            <h2 className="EDP-card-title">Recent Leave Requests</h2>
            <p className="EDP-card-description">Your latest leave applications</p>
          </div>
          <div className="EDP-card-content">
            {leaveapplication.length === 0 ? (
              <p className="EDP-no-requests">No leave requests found.</p>
            ) : (
              <div className="EDP-leave-list">
                {leaveapplication.map((leave) => (
                  <div key={leave.id} className="EDP-leave-item">
                    <div className="EDP-leave-header">
                      <div>
                        <h3>{leave.type_name}</h3>
                        <p className="EDP-leave-date">{new Date(leave.from_date).toLocaleDateString()} to {new Date(leave.to_date).toLocaleDateString()} ({calculateDuration(leave.from_date, leave.to_date)}days)</p>
                      </div>
                      <span className={`EDP-leave-status ${leave.status}`}>{leave.status}</span>
                    </div>
                    <p className="EDP-leave-reason">{leave.description}</p>
                    {leave.comment && (
                      <div className="EDP-leave-comment">
                        <span>Comment: </span>{leave.approved_by}
                      </div>
                    )}
                    <div className="EDP-leave-status-indicator">
                      {leave.status === 'approved' && (
                        <span className="EDP-text-green"><CheckCircle className="EDP-icon" /> Approved</span>
                      )}
                      {leave.status === 'rejected' && (
                        <span className="EDP-text-red"><XCircle className="EDP-icon" /> Rejected</span>
                      )}
                      {leave.status === 'pending' && (
                        <span className="EDP-text-yellow"><Clock className="EDP-icon" /> Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="EDP-view-all">
              <Link to="/employee/leave-history">
                <button className="EDP-btn">View All Leave History</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="EDP-card EDP-quick-actions-card">
          <div className="EDP-card-header">
            <h2 className="EDP-card-title">Quick Actions</h2>
            <p className="EDP-card-description">Common tasks you might want to perform</p>
          </div>
          <div className="EDP-card-content quick-actions">
            <Link to="/employee/apply-leave">
              <button className="EDP-btn w-full">
                <Calendar className="h-4 w-4 mr-2" /> Apply for Leave
              </button>
            </Link>
            <Link to="/employee/profile">
              <button className="EDP-btn-outline w-full">Update Profile</button>
            </Link>
            <Link to="/employee/settings/change-password">
              <button className="EDP-btn-outline w-full">Change Password</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
