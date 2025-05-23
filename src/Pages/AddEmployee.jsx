import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/AddEmployee.css';
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import EmployeeForm from './EmployeeForm';


const AddEmployee = () => {
  const handleAddEmployee = (employeeData) => {
    console.log('Adding employee:', employeeData);
    toast.success("Employee added successfully");

  };

  return (
    <div className="add-employee">
      <header className="add-employee-header">
        <Link to="/admin/employees" className="add-employee-back-link">
          <ChevronLeft size={16} className="add-employee-back-icon" />
          Back to Employees List
        </Link>
        <h1 className="add-employee-page-title">Add New Employee</h1>
        <p className="add-employee-subtitle">Create a new employee account</p>
      </header>

      <div className="add-employee-form-card">
        <div className="add-employee-form-card-header">
          <h2>Employee Information</h2>
          <p className="add-employee-description">
            Fill in the employee details below. All fields marked with * are required.
          </p>
        </div>
        <div className="add-employee-form-card-content">
          <EmployeeForm onSubmit={handleAddEmployee} />
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
