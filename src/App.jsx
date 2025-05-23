
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Adminlayout from './Components/Adminlayout'
import AdminDashboard from './Pages/AdminDashboard'
import DepartmentManagement from './Pages/DepartmentManagement'
import LeaveType from './Pages/LeaveType'
import EmployeeManagement from './Pages/EmployeeManagement'
import AddEmployee from './Pages/AddEmployee'
import LeaveManagement from './Pages/LeaveManagement'
import ApprovedLeaves from './Pages/ApprovedLeaves'
import PendingLeaves from './Pages/PendingLeaves'
import RejectedLeaves from './Pages/RejectedLeaves'
import LeaveDetails from './Pages/LeaveDetails'
import ChangePasswordForm from './Pages/ChangePasswordForm'
import EmployeeLayout from './Components/EmployeeLayout'
import EmployeeDashboard from './EmployeePages/EmployeeDashboard'
import ApplyLeave from './EmployeePages/ApplyLeave'
import LeaveHistory from './EmployeePages/LeaveHistory'
import Profile from './EmployeePages/Profile'
import Login from './Components/Login'
import Signup from './Components/Signup'
import { Toaster } from 'sonner'
function App() {
  return (
    <>
    <BrowserRouter>
     <Toaster richColors position="top-right" />
    <Routes>
    
      <Route path='/' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route element={<Adminlayout/>}>
      <Route path='/admin' element={<AdminDashboard/>}></Route>
      <Route path='/admin/departments' element={<DepartmentManagement/>}></Route>
      <Route path='/admin/leave-types' element={<LeaveType/>}></Route>
      <Route path='/admin/employees' element={<EmployeeManagement/>}></Route>
      <Route path='/admin/employees/add' element={<AddEmployee />}></Route>
      <Route path='/admin/leave-applications' element={<LeaveManagement/>}></Route>
      <Route path='/admin/leave-applications/approved'element={<ApprovedLeaves/>}></Route>
      <Route path='/admin/leave-applications/pending'element={<PendingLeaves/>}></Route>
      <Route path='/admin/leave-applications/rejected'element={<RejectedLeaves/>}></Route>
      <Route path="/admin/leave-applications/:id" element={<LeaveDetails />} ></Route>
      <Route path="/admin/settings/change-password" element={<ChangePasswordForm />} />
      </Route>
      <Route element={<EmployeeLayout/>}>
      <Route path='/employee' element={<EmployeeDashboard/>}></Route>
      <Route path="/employee/settings/change-password" element={<ChangePasswordForm />} />
      <Route path="/employee/apply-leave" element={<ApplyLeave/>}></Route>
      <Route path="/employee/leave-history" element={<LeaveHistory/>}></Route>
      <Route path='/employee/profile' element={<Profile/>}></Route>
      <Route path="/employee/leave-applications/:id" element={<LeaveDetails />} ></Route>

      </Route>
    </Routes>
    </BrowserRouter>
   
    </>
  )
}

export default App
