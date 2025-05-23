import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Home,
  Building2,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import '../Styles/Employeelayout.css'

function Employeelayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const name= localStorage.getItem("name")
  const role = localStorage.getItem("role");

  if (role !== "employee") {
    return <Navigate to="/" />;
  }

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.clear();
    navigate('/');
    navigate('/');
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/employee', icon: <Home className="icon" /> },
    { name: 'Apply for Leave', path: '/employee/apply-leave', icon: <Building2 className="icon" /> },
    { name: 'Leave History', path: '/employee/leave-history', icon: <Calendar className="icon" /> },
    { name: 'My Profile', path: '/employee/profile', icon: <Users className="icon" /> },

     {
      name: 'Settings',
      icon: <Settings className="icon" />,
      children: [
        { name: 'Change Password', path: '/employee/settings/change-password' },
      ],
    }

  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || (path !== '/employee' && location.pathname.startsWith(path));
  };
const handleDropdownToggle = (name) => {
  setOpenDropdown((prev) => (prev === name ? null : name));
};
  return (
    <div className="employee-layout">
      <aside className="employee-sidebar">
        <div className="employee-sidebar-header">
          <h1 className="employee-logo">Leave Management</h1>
        </div>
        <nav className="employee-nav-menu">
          {navItems.map((item, index) => (
            item.children ? (
              <div key={index} className="employee-nav-dropdown">
                <button
                  className={`employee-nav-link ${isActive('/employee/settings') ? 'active' : ''}`}
                  onClick={() => handleDropdownToggle(item.name)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
                {openDropdown === item.name && (
                  <div className="employee-dropdown-children">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`employee-nav-sublink ${isActive(child.path) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`employee-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setOpenDropdown(null);
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          ))}


        </nav>
        <div className="employee-sidebar-footer">
          <div className="employee-user-info">
            <div className="employee-user-avatar">{name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="employee-user-name">{name}</p>
              <p className="employee-user-role">{role}</p>
            </div>
          </div>
          <button className="employee-logout-btn" onClick={handleLogout}>
            <LogOut className="employee-icon" />
            Logout
          </button>
        </div>
      </aside>

      <div className="employee-main-section">
        <header className="employee-mobile-header">
          <button className="employee-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="employee-icon" /> : <Menu className="employee-icon" />}
          </button>
          <h1 className="employee-mobile-logo">Leave Management</h1>
          <div className="employee-user-avatar-mobile">{name?.charAt(0).toUpperCase()}</div>
        </header>

        {isMobileMenuOpen && (
          <div className="employee-mobile-menu-overlay" onClick={toggleMobileMenu}>
            <div className="employee-mobile-menu" onClick={e => e.stopPropagation()}>
              <div className="employee-mobile-menu-header">
                <h1 className="employee-logo">Leave Management</h1>
                <button onClick={toggleMobileMenu}><X className="employee-icon" /></button>
              </div>
              <nav className="employee-nav-menu">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`employee-nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="employee-sidebar-footer">
                <div className="employee-user-info">
                  <div className="employee-user-avatar">{name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="employee-user-name">{name}</p>
                    <p className="employee-user-role">Administrator</p>
                  </div>
                </div>
                <button className="employee-logout-btn" onClick={(e) => { handleLogout(e); toggleMobileMenu(); }}>
                  <LogOut className="employee-icon" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="employee-content">
          <Outlet />
        </main>
      </div>
       {children}
    </div>
  );
}

export default Employeelayout;
