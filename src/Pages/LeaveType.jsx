import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Card, CardContent,
  CardHeader, Typography, InputAdornment, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import '../Styles/LeaveType.css';
import axios from '../Components/axiosInstance';
import { toast } from 'sonner';

const API_BASE = 'https://employee-leave-management-x4wr.onrender.com/api';

function LeaveType() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [newType, setNewType] = useState({ type_name: '', description: '' });
  const [errors, setErrors] = useState({});

  const validateForm = (fields) => {
    const newErrors = {}
    if (!fields.type_name?.trim()) newErrors.type_name = 'Leave type is required';
    if (!fields.description?.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/list-leave-types`);
      setLeaveTypes(res.data);
      
    } catch (err) {
      console.error("Failed to fetch leave types:", err);
    }
  };



  const filteredLeaveTypes = leaveTypes.filter(type =>
    `${type.type_name ?? ''} ${type.description ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase()))


  const handleAdd = async () => {
    if (!validateForm(newType)) return;
    try {
      await axios.post(`${API_BASE}/add-leave-types`, newType);
      setOpenAdd(false);
      setNewType({ type_name: '', description: '' });
    toast.success("Levae Tpye Added successfully");

      setErrors({});
      fetchLeaveTypes();
    } catch (err) {
      console.error("Error adding leave type:", err);
    }
  };

  const handleEdit = async () => {
    if (!validateForm(currentType)) return;
    try {
      const res = await axios.put(`${API_BASE}/update-leave-types/${currentType.id}`, currentType);
      setLeaveTypes(leaveTypes.map(t => t.id === currentType.id ? res.data : t));
    toast.success("Levae Tpye Updated successfully");

      setOpenEdit(false)
      fetchLeaveTypes()
      setErrors({})
    } catch (err) {
      console.error("Error updating leave type:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/delete-leave-types/${currentType.id}`);
      setLeaveTypes(leaveTypes.filter(d => d.id !== currentType.id));
    toast.success("Levae Tpye Deleted successfully");
      setOpenDelete(false);
    } catch (err) {
      console.error("Error deleting leave type:", err);
    }
  }

  return (
    <div className="LTP-leave-type-container">
      <div className="LTP-leave-type-header">
        <div>
          <h1>Leave Type Management</h1>
          <p>Add, edit or remove leave types</p>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)}>
          Add Leave Type
        </Button>
      </div>

      <Card>
        <CardHeader title="All Leave Types" subheader="Manage leave categories for your organization" />
        <CardContent className='LTP-table-content'>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search leave types..."
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
          <TableContainer component={Paper} className="LTP-table-wrapper">
            <Table className="LTP-leave-type-table">
              <TableHead>
                <TableRow>
                  <TableCell>S.NO</TableCell>
                  <TableCell>Type Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaveTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No leave types found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeaveTypes.map((type, index) => (
                    <TableRow key={type.id || `type-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{type.type_name}</TableCell>
                      <TableCell>{type.description}</TableCell>
                      <TableCell>{new Date(type.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => { setCurrentType(type); setOpenEdit(true); }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => { setCurrentType(type); setOpenDelete(true); }}>
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

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Leave Type</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Type Name"
            fullWidth
            value={newType.type_name}
            onChange={(e) => setNewType({ ...newType, type_name: e.target.value })}
            error={!!errors.type_name}
            helperText={errors.type_name}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newType.description}
            onChange={(e) => setNewType({ ...newType, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenAdd(false); setErrors({}); }}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Leave Type</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Type Name"
            fullWidth
            value={currentType?.type_name || ''}
            onChange={(e) => setCurrentType({ ...currentType, type_name: e.target.value })}
            error={!!errors.type_name}
            helperText={errors.type_name}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={currentType?.description || ''}
            onChange={(e) => setCurrentType({ ...currentType, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenEdit(false); setErrors({}); }}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Leave Type</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{currentType?.type_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LeaveType;
