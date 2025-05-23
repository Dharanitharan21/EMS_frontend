import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import '../Styles/EmployeeManagement.css';
import { Plus, Edit, Trash2, X, Check, Eye } from "lucide-react";
import { toast } from "sonner";
import EmployeeForm from './EmployeeForm';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from "../Components/axiosInstance";
const API_BASE = "https://employee-leave-management-x4wr.onrender.com/api";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await axios.get(`${API_BASE}/listdepartments`);
      setDepartments(res.data);
      console.log(res.data);

    };
    fetchDepartments();
  }, []);
  const getDepartmentName = (id) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.department_name : 'Unknown';
  };

  // 🔄 Fetch users from API
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getusers`);
      setEmployees(res.data);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  // ✅ Toggle employee_status
  const toggleEmployeeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`${API_BASE}/updateStatus-users/${id}/status`, { employee_status: newStatus });
      toast.success("Status updated");
      fetchEmployees();
    } catch (err) {
      toast.error("Failed to update employee status");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentEmployees = employees.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(employees.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <div className="EMP-employee-management">
      <header className="EMP-header">
        <h1>Employee Management</h1>
        <p>Manage company employees</p>
      </header>

      <div className="EMP-card">
        <div className="EMP-card-header">
          <div>
            <h2>Employees</h2>
            <p>Manage Employee details and Employee status</p>
          </div>
          <Link to="/admin/employees/add" className="EMP-btn-primary-link" >
            <button className="EMP-btn-primary">
              <Plus size={16} /> Add Employee
            </button>
          </Link>
        </div>

        <div className="EMP-table-container">
          <table className="EMP-employee-table">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}</td>
                  <td>{emp.employee_code}</td>
                  <td>{emp.first_name} {emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.mobile}</td>
                  <td>{getDepartmentName(emp.department_id)}</td>

                  <td>
                    <span className={`EMP-status ${emp.employee_status || 'unknown'}`}>
                      {typeof emp.employee_status === 'string'
                        ? emp.employee_status.charAt(0).toUpperCase() + emp.employee_status.slice(1)
                        : 'Unknown'}
                    </span>

                  </td>
                  <td>
                    <div className="EMP-action-buttons">
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setIsViewDialogOpen(true);
                        }}
                        className="EMP-btn-view">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => toggleEmployeeStatus(emp.id, emp.employee_status)} className={emp.employee_status === 'active' ? 'EMP-btn-deactivate' : 'EMP-btn-activate'}>
                        {emp.employee_status === 'active' ? <X size={16} /> : <Check size={16} />}
                      </button>
                    </div>
                  </td>

                </tr>

              ))}
            </tbody>
          </table>
          <div className="EMP-pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <div className="EMP-employee-details">
              <p><strong>Code:</strong> {selectedEmployee.employee_code}</p>
              <p><strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Mobile:</strong> {selectedEmployee.mobile}</p>
              <p><strong>DOB:</strong> {new Date(selectedEmployee.birth_date).toLocaleDateString()}</p>

              <p><strong>City:</strong> {selectedEmployee.city}</p>
              <p><strong>Country:</strong> {selectedEmployee.country}</p>
              <p><strong>Address:</strong> {selectedEmployee.address}</p>

              <p><strong>Department:</strong> {getDepartmentName(selectedEmployee.department_id)}</p>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default EmployeeManagement;
