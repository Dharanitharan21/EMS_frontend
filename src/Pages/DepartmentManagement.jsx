import { useEffect, useState } from 'react';
import axios from '../Components/axiosInstance';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Typography,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Search, Add, Edit ,Delete} from '@mui/icons-material';
import '../Styles/DepartmentManagement.css';
import { toast } from "sonner";

const API_BASE = 'https://employee-leave-management-x4wr.onrender.com/api';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ dept_code: '', dedepartment_name: '', short_name: '' });
  const [errors, setErrors] = useState({});

  const validateForm = (fields) => {
    const newErrors = {};
    if (!fields.dept_code?.trim()) newErrors.dept_code = 'Code is required';
    if (!fields.department_name?.trim()) newErrors.department_name = 'Name is required';
    if (!fields.short_name?.trim()) newErrors.short_name = 'Short name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    fetchDepartments();
  }, []);
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/listdepartments`);
      setDepartments(res.data);
      console.log(res.data);

    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };



  const filteredDepartments = departments.filter(dep =>
    `${dep.department_name ?? ''} ${dep.short_name ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = async () => {
    if (!validateForm(newDepartment)) return;
    try {
      const res = await axios.post(`${API_BASE}/addDepartments`, newDepartment);
      setOpenAdd(false);
      setNewDepartment({ dept_code: '', department_name: '', short_name: '' })
    toast.success("Department Added successfully");

      fetchDepartments()
    } catch (err) {
      console.error("Error adding department:", err);
    }
  };

  const handleEdit = async () => {
    if (!validateForm(currentDepartment)) return;
    try {
      const res = await axios.put(`${API_BASE}/updatedepartments/${currentDepartment.id}`, currentDepartment);
      setDepartments(departments.map(dept => dept.id === currentDepartment.id ? res.data : dept));
      setOpenEdit(false)
    toast.success("Department updated successfully");

      fetchDepartments()
    } catch (err) {
      console.error("Error updating department:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/deletedepartments/${currentDepartment.id}`);
      setDepartments(departments.filter(d => d.id !== currentDepartment.id));
    toast.success("Department Deleted successfully");

      setOpenDelete(false);
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };
  const handleAddClose = () => {
    setErrors({});
    setOpenAdd(false);
  };

  const handleEditClose = () => {
    setErrors({});
    setOpenEdit(false);
  };


  return (
    <div className="DM-department-container">
      <div className="DM-department-header">
        <div>
          <h1>Department Management</h1>
          <p>Add, edit or remove departments</p>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)}>
          Add Dept
        </Button>
      </div>

      <Card>
        <CardHeader title="All Departments" subheader="Manage your organizational structure" />
        <CardContent className='DM-table-content' >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <TableContainer component={Paper} className="DM-table-wrapper">
            <Table className="DM-department-table">
              <TableHead>
                <TableRow>
                  <TableCell>S.NO</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Department Name</TableCell>
                  <TableCell>Short Name</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No departments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((dept, index) => (
                    <TableRow key={dept.id || `dept-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{dept.dept_code}</TableCell>
                      <TableCell>{dept.department_name}</TableCell>
                      <TableCell>{dept.short_name}</TableCell>
                      <TableCell>{new Date(dept.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => { setCurrentDepartment(dept); setOpenEdit(true); }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => { setCurrentDepartment(dept); setOpenDelete(true); }}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>


      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Department Code"
            fullWidth
            error={!!errors.dept_code}
            helperText={errors.dept_code}
            value={newDepartment.dept_code || ''}
            onChange={(e) => setNewDepartment({ ...newDepartment, dept_code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Department Name"
            fullWidth
            error={!!errors.department_name}
            helperText={errors.department_name}
            value={newDepartment.department_name || ''}
            onChange={(e) => setNewDepartment({ ...newDepartment, department_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Short Name"
            fullWidth
            error={!!errors.short_name}
            helperText={errors.short_name}
            value={newDepartment.short_name || ''}
            onChange={(e) => setNewDepartment({ ...newDepartment, short_name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Department Code"
            fullWidth
            error={!!errors.dept_code}
            helperText={errors.dept_code}
            value={currentDepartment?.dept_code || ''}
            onChange={(e) => setCurrentDepartment({ ...currentDepartment, dept_code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Department Name"
            fullWidth
            error={!!errors.department_name}
            helperText={errors.department_name}
            value={currentDepartment?.department_name || ''}
            onChange={(e) => setCurrentDepartment({ ...currentDepartment, department_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Short Name"
            fullWidth
            error={!!errors.short_name}
            helperText={errors.short_name}
            value={currentDepartment?.short_name || ''}
            onChange={(e) => setCurrentDepartment({ ...currentDepartment, short_name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{currentDepartment?.department_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;
